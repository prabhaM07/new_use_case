import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { clearCredentials } from "../slices/authSlice";
import { logoutUser } from "../services/authApi";

export default function Logout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);   

    const handleOnClick = async ( e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setError('');
        setIsLoading(true);

         try {
            await logoutUser();
            dispatch(clearCredentials());
            navigate('/');
        }
        catch(err: any){
            const message =
            err?.response?.data?.detail?.detail ||
            err?.response?.data?.detail ||
            "Logout failed";

            setError(String(message));
        } 
        finally {
            setIsLoading(false);
        }
    }

    return (
    <>
    <button onClick={handleOnClick}>Logout</button>
    </>
    );

}