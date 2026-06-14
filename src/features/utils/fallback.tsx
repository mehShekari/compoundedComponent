export default function FallBack({ message }: { message: string})
{
    return <>Error <span style={{ color: "crimson" }}>{message}</span></>
}