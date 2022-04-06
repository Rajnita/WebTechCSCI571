import { useState } from 'react'
function App() {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [director, setDirector] = useState("");
    const handleOnSubmit = async (e) => {
        alert("Sending "+JSON.stringify({ title, genre, director}));
        e.preventDefault();
        let result = await fetch(
            'http://localhost:9000/register', {
                method: "post",
                body: JSON.stringify({ title, genre, director}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved successfully");
            setGenre("");
            setTitle("");
            setDirector("");
        }
    }
    return (
        <>
            <h1>This is a React WebApp </h1>
            <form action="">
                <input type="text" placeholder="movie title"
                       value={title} onChange={(e) => setTitle(e.target.value)} />

                <input type="text" placeholder="genre"
                       value={genre} onChange={(e) => setGenre(e.target.value)} />
                <input type="text" placeholder="director"
                       value={director} onChange={(e) => setDirector(e.target.value)} />
                <button type="submit"
                        onClick={handleOnSubmit}>submit</button>
            </form>

        </>
    );
}

export default App;