import styled from "styled-components"

const Wrapper = styled.div`
    padding: 5px;
    display: flex;
    gap: 7px;
`

export default function TableCompoundActions ({})
{
    return <Wrapper>
        <button>add</button>
        <button>edit</button>
    </Wrapper>
}