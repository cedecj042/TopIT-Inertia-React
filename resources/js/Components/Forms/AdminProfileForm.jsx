export default function AdminProfileForm({onclose,auth}){
    return(
        <>
            <div className="modal-body">
                <form>

                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onclose}>Cancel</button>
                <button type="button" className="btn btn-primary">Save</button>
            </div>
        
        </>
    );
}