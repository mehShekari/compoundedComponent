const Actions = ({ className }: { className?: string }) =>
{
    return <div>
        <button className={className}>actions</button>
    </div>
}
Actions.displayName = "header-actions";
export default Actions; 