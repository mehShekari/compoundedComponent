import { usePageCompoundActionsContext } from "../actions"

export default function AddComponent({ onClick }: { onClick?: (arg?: any) => void })
{
    const { addHandler } = usePageCompoundActionsContext();
    
    return <div>
        <button onClick={() => onClick ? onClick(): addHandler()}>🗑</button>
    </div>
}