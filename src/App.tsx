import './App.css'
import PageCompound from './components/pageCompound'
import TableCompound from './components/tableCompound'

function App() {
    return <div>
        <PageCompound>
            <PageCompound.Header />
            <PageCompound.Body >
                <TableCompound columns={["name", "age"]} captions={["Name", "Age"]}>
                    <TableCompound.Header />
                    <TableCompound.Body />
                    <TableCompound.Footer />
                </TableCompound>
            </PageCompound.Body>
            <PageCompound.Footer />
        </PageCompound>
    </div>
}

export default App