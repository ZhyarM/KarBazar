<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\MessageSent;

class MessageController extends Controller
{
    // Get conversations list
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        // Get unique conversation partners with last message
        $conversations = Message::where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                      ->orWhere('receiver_id', $userId);
            })
            ->with(['sender.profile', 'receiver.profile'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($message) use ($userId) {
                // Group by the other user's ID
                return $message->sender_id == $userId ? $message->receiver_id : $message->sender_id;
            })
            ->map(function ($messages) use ($userId) {
                $lastMessage = $messages->first();
                $otherUserId = $lastMessage->sender_id == $userId ? $lastMessage->receiver_id : $lastMessage->sender_id;
                $otherUser = User::with('profile')->find($otherUserId);
                
                // Count unread messages
                $unreadCount = Message::where('sender_id', $otherUserId)
                    ->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'image' => $otherUser->image,
                        'profile' => $otherUser->profile,
                    ],
                    'last_message' => [
                        'content' => $lastMessage->content,
                        'created_at' => $lastMessage->created_at,
                        'is_sent_by_me' => $lastMessage->sender_id == $userId,
                    ],
                    'unread_count' => $unreadCount,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    // Get messages with a specific user
    public function messages(Request $request, $userId)
    {
        $currentUserId = $request->user()->id;

        $messages = Message::where(function ($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $currentUserId)
                      ->where('receiver_id', $userId);
            })
            ->orWhere(function ($query) use ($currentUserId, $userId) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', $currentUserId);
            })
            ->with(['sender.profile', 'receiver.profile'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        Message::where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'data' => MessageResource::collection($messages),
        ]);
    }

    // Send message
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'attachments' => 'nullable|array',
        ]);

        // Check if trying to message self
        if ($request->receiver_id == $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot send message to yourself',
            ], 400);
        }

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'attachments' => $request->attachments,
        ]);

        // Broadcast the message
        broadcast(new MessageSent($message->load(['sender.profile', 'receiver.profile'])))->toOthers();

        // Create notification
        Notification::create([
            'user_id' => $request->receiver_id,
            'type' => 'message',
            'title' => 'New Message',
            'message' => $request->user()->name . ' sent you a message',
            'link' => '/messages/' . $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => new MessageResource($message->load(['sender.profile', 'receiver.profile'])),
        ], 201);
    }

    // Mark message as read
    public function markAsRead(Request $request, $id)
    {
        $message = Message::findOrFail($id);

        // Check if user is the receiver
        if ($message->receiver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $message->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read',
        ]);
    }

    // Delete message
    public function destroy(Request $request, $id)
    {
        $message = Message::findOrFail($id);

        // Check if user is sender or receiver
        if ($message->sender_id !== $request->user()->id && 
            $message->receiver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully',
        ]);
    }
}