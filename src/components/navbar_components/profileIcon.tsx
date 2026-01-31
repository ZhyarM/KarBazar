import { Link } from "react-router-dom";


interface profileProps {
    username: String ;
}


const profile= ({username}:profileProps)=> {
    


    return <div className="flex flex-row gap-2" >
        <Link to="/profile">
        
        <div className="rounded-full w-8 h-8 bg-(--color-accent) flex flex-row items-center justify-center">

        </div>
        </Link>
    
        <div className="text-(--color-text) flex justify-center items-center  text-lg">
            <p>welcome, {username}</p>
        </div>
    
    </div>
    
} 

export default profile;

