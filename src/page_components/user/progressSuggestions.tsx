interface suggestionsprops{
    text:string
}

function progressSuggestions(props:suggestionsprops) {
    return <div className="rounded-xl bg-white max-w-fit p-1 border border-gray-300 cursor-pointer">
      <p className="text-sm text-gray-500">{props.text}</p>
    </div>
}

export default progressSuggestions