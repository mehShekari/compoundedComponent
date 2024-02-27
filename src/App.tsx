import { useState } from 'react'
import './App.css'
import PageCompound from './components/pageCompound/pageCompound'
import TableCompound from './components/tableCompound/tableCompound'
import TestComponent from './components/component.test'
import ErrorBoundary from './utils/errorBoundary'

function App() {
    const [state, setState] = useState(0)
    console.log(state)

    return (
        <ErrorBoundary fallBack={<>Error</>}>
            <PageCompound>
                <PageCompound.Header>
                    <PageCompound.Header.MultiSearch />
                    <PageCompound.Header.SingleSearch />
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
                                            {({ DeleteBtn, EditBtn, DetailBtn }) => <>
                                                <DeleteBtn />
                                                <EditBtn />
                                                <DetailBtn />
                                            </>}
                                        </TableCompound.Body.Row.Actions>
                                    </TableCompound.Body.Row>
                                }
                                return <TableCompound.Body.Row key={index} row={item} />
                            }}
                        </TableCompound.Body>
                    </TableCompound>
                </PageCompound.Body>
                <PageCompound.Footer />
            </PageCompound>
            {/* <TestComponent /> */}
        </ErrorBoundary>
    )
}

export default App