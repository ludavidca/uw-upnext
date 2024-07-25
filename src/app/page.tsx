"use client"

export default function Home() {
  const getMessages = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/getMessages")
      const data = await res.json()
      console.log(data)
      console.log("hello")
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="h-20 bg-transparent"></div>
      <div className="flex flex-col justify-center overflow-y-auto">
        <form onSubmit={getMessages}>
          <button type="submit">QueryDB</button>
        </form>
        {/* {messages.map((message) => (
          <div className={`flex-row max-h-screen`}>
              <p
                className={`rounded-lg border border-black p-4 mx-10 my-5 ${
                  parseInt(message.sent_to) % 2 === 0
                    ? "bg-white"
                    : "bg-rose-300"
                }`}
              >
                {message.content}
              </p>
          </div>
        ))} */}
      </div>
      <div className="h-20 bg-transparent"></div>
    </div>
  );
}
