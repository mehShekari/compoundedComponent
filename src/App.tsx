import { useState } from 'react'
import './App.css'
import PageCompound from './components/pageCompound/pageCompound'
import TableCompound from './components/tableCompound/tableCompound'

function App() {
    const [state, setState] = useState(0)
    console.log(state)

    return (
        <>
            <PageCompound>
                <PageCompound.Header>
                    <PageCompound.Header.Actions className='bg-red' />
                </PageCompound.Header>

                <PageCompound.Body>
                    <TableCompound captions={["name", "age"]} columns={["name", "age"]}>
                        <TableCompound.Body>
                            {({ index, item }) => {
                                if (index === 0) {
                                    return <TableCompound.Body.Row key={index} className='bg-red'
                                        rest={{
                                            onClick(_) {
                                                setState(prev => prev + 1)
                                            }
                                        }}
                                    >
                                        <TableCompound.Body.Row.Td row={item} />
                                        <TableCompound.Body.Row.Actions row={item}>
                                            {({ DeleteBtn, DeleteHandler }) => <>
                                                <DeleteBtn onClick={(row: any) => console.log("custom click", row)} />
                                                <button onClick={() => DeleteHandler(item)}>ddd</button>
                                            </>}
                                            {/* <TableCompound.Body.Row.Actions.Delete />
                                            <TableCompound.Body.Row.Actions.Edit /> */}
                                            {/* <TableCompound.Body.Row.Actions.Detail /> */}
                                        </TableCompound.Body.Row.Actions>
                                    </TableCompound.Body.Row>
                                }
                                return <TableCompound.Body.Row key={index} row={item} />

                                //* second way to access the row of table
                                // return <Row key={index}>
                                //     <Row.Td row={item} />
                                //     <Row.Actions>
                                //         <Row.Actions.Edit />
                                //         <Row.Actions.Delete />
                                //         {/* <Row.Actions.Detial /> */}
                                //     </Row.Actions>
                                // </Row>
                            }}
                        </TableCompound.Body>
                    </TableCompound>
                </PageCompound.Body>
                <PageCompound.Footer />
            </PageCompound>
        </>
    )
}

export default App