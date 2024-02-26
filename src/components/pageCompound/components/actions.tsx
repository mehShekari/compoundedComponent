const Actions = ({ className, children }: { className?: string, children?: React.ReactNode }) =>
{
    return <div>
        <button className={className}>actions</button>
    </div>
}
Actions.displayName = "header-actions";
export default Actions; 