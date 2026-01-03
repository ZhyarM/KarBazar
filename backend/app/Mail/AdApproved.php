<?php

namespace App\Mail;

use App\Models\AdRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $adRequest;

    public function __construct(AdRequest $adRequest)
    {
        $this->adRequest = $adRequest;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Advertisement Request Approved - KarBazar',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ad-approved',
        );
    }
}