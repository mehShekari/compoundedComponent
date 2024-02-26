import './App.css'
import PageCompound from './components/pageCompound/pageCompound'
import TableCompound from './components/tableCompound/tableCompound'

function App() {
    return (
        <>
            <PageCompound>
                <PageCompound.Header>
                    {/* <PageCompound.Header.SingleSearch key="singleSearch" /> */}
                    <PageCompound.Header.Actions key={"actions"} className="bg-red" />
                    <PageCompound.Header.MultiSearch key={"multiSearch"} />
                </PageCompound.Header>

                <PageCompound.Body >
                    <TableCompound>
                        <TableCompound.Header>

                        </TableCompound.Header>

                        <TableCompound.Body>
                            {({ index }) => {
                                if (index === 0) {
                                    return <TableCompound.Body.Row rest={{
                                        onClick(_) {
                                            console.log("custom onclick")
                                        }
                                    }}>
                                        custom row
                                    </TableCompound.Body.Row>
                                }
                                return <TableCompound.Body.Row />
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