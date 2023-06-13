// import './App.css'
import "bulma";
import { useCallback, useState } from "react";
import { Loader } from "./components/Loader";
import { FileInput } from "./components/FileInput";
import { Error } from "./types/Error";
import { ErrorMessage } from "./components/ErrorMessage";
import { getHeatMap } from "./scripts/script";

function App() {
  const [canvas, setCanvas] = useState<string>("");
  const [error, setError] = useState(Error.NONE);
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleError = (error: Error) => {
    setError(error);

    setTimeout(() => {
      setError(Error.NONE);
    }, 5000);
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];

      if (!file) {
        return;
      }

      const isGrid = file?.name.slice(-5) === ".grid";

      if (!isGrid) {
        handleError(Error.EXT);
        return;
      }

      const hasRightSize = file?.size === 647964000;

      if (!hasRightSize) {
        handleError(Error.SIZE);
        return;
      }

      setFile(file);
    },
    [setFile]
  );

  const generateMap = async () => {
    if (!file) {
      return;
    }

    setLoading(true);
    setError(Error.NONE);

    try {
      const canvas = await getHeatMap(file);

      setCanvas(canvas || "");
    } catch {
      handleError(Error.READ);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-5">
      <h1 className="title is-1">World water temperature heatmap</h1>

      <div className="flex gap-5 mb-5">
        <FileInput onFileChange={handleFileChange} filename={file?.name} />

        <button
          disabled={!file}
          className="button is-primary"
          onClick={generateMap}
        >
          Generate Map
        </button>
      </div>

      <div className="relative">
        <img src={canvas || "src/assets/empty-map.jpg"} alt="Canvas" />

        {isLoading && <Loader />}
      </div>

      {error && (
        <ErrorMessage onClose={() => setError(Error.NONE)} error={error} />
      )}
    </main>
  );
}

export default App;
