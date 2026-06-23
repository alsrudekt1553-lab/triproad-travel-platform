import AddComponent from "../../components/todo/addComponent";

function AddPage() {
    return ( 
        <div className="bg-white rounded-lg p-4 m-2 w-full">
            <div className="text-4xl">Add Todo</div>
            <AddComponent/>
        </div>

    );
}

export default AddPage;