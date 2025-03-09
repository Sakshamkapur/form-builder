import QuestionBuilder from "./components/questions/QuestionBuilder";

const theme = {
  colors: {
    primary: {
      dark: "#2E382E",
      teal: "#50C9CE",
      blue: "#72A1E5",
      purple: "#9883E5",
      pink: "#FCD3DE",
    },
  },
};

export { theme };

function App() {
  return (
    <div className="App min-h-screen bg-[#FCD3DE] text-[#2E382E]">
      <QuestionBuilder />
    </div>
  );
}

export default App;
