import { useState } from 'react'
import './App.css'
import PageCompound from './components/pageCompound/pageCompound'
import TableCompound from './components/tableCompound/tableCompound'
import ErrorBoundary from './utils/errorBoundary'
import FallBack from './utils/fallback'

function App() {
    const [state, setState] = useState(0)
    console.log(state)

    return (
        <ErrorBoundary fallBack={(message) => {
            return <FallBack message={message} />
        }}>
            <PageCompound>
                <PageCompound.Body>
                    <TableCompound captions={["name", "age"]} columns={["name", "age"]}>
                        <TableCompound.Header />
                        <TableCompound.Body>
                            {({ index, item }) => {
                                if (index === 0) {
                                    return <TableCompound.Body.Row index={index} key={index} className='bg-red'
                                        rest={{
                                            onClick(_) {
                                                setState(prev => prev + 1)
                                            }
                                        }}
                                    >
                                        <TableCompound.Body.Row.Td row={item} />
                                        <TableCompound.Body.Row.Actions row={item} index={index}>
                                            {({ DeleteBtn, EditBtn, DetailBtn }) => <>
                                                <DeleteBtn />
                                                <EditBtn />
                                                <DetailBtn />
                                            </>}
                                        </TableCompound.Body.Row.Actions>
                                    </TableCompound.Body.Row>
                                }
                                return <TableCompound.Body.Row key={index} row={item} index={index} />
                            }}
                        </TableCompound.Body>
                    </TableCompound>
                </PageCompound.Body>
            </PageCompound>
        </ErrorBoundary>
    )
}

export default App