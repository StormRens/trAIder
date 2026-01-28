
function Food(){
    //Here is where you can create a JS constant/variable.
    const food1 = "Orange"; 
    const food2 = "Bananna"; 


    return(
        <ul>
            <li>Apple</li>
            <li>{food1}</li>
            <li>{food2.toUpperCase()}</li>
        </ul>
    );
}

export default Food