import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";

function ReadComponent({ product }: { product: ProductDTO }) {

    const { moveToList  , moveToModify} = useCustomMove();


    return ( 
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4 bg-white"> 
            <div className="flex justify-center mt-10">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-3 text-right font-bold">PNO</div> {/* p-6 -> p-3 */}
                    <div className="w-4/5 p-3 rounded-r border border-solid shadow-md"> {/* p-6 -> p-3 */}
                        {product.pno}    
                    </div> 
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-3 text-right font-bold">PNAME</div> {/* p-6 -> p-3 */}
                    <div className="w-4/5 p-3 rounded-r border border-solid shadow-md"> {/* p-6 -> p-3 */}
                        {product.pname}    
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-3 text-right font-bold">PRICE</div> {/* p-6 -> p-3 */}
                    <div className="w-4/5 p-3 rounded-r border border-solid shadow-md"> {/* p-6 -> p-3 */}
                        {product.price}    
                    </div>
                </div> 
            </div>
            <div className="flex justify-center">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-3 text-right font-bold">PDESC</div> {/* p-6 -> p-3 */}
                    <div className="w-4/5 p-3 rounded-r border border-solid shadow-md"> {/* p-6 -> p-3 */}
                        {product.pdesc}    
                    </div>
                </div>
            </div>
            <div className="w-full justify-center flex flex-col m-auto items-center">
                {product.uploadFileNames.map( (imgFile, i) => 
                <img 
                alt ="product"
                key={i}
                className="p-2 w-1/2" /* p-4 -> p-2 */
                src={`${API_SERVER_HOST}/api/products/view/${imgFile}`}/>
                )}
            </div>
            
            <div className="flex justify-end p-4">
                <button type="button" 
                className="inline-block rounded p-2 m-2 text-xl w-32 text-white bg-red-500"  
                onClick={() => moveToModify(product.pno)}
                >
                    Modify
                </button>
                <button type="button" 
                className="rounded p-2 m-2 text-xl w-32 text-white bg-blue-500"  
                onClick={() => moveToList()}
                >
                    List
                </button> 
            </div>
        </div>

    );
}

export default ReadComponent;