import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <header className="flex items-center justify-between p-4 bg-[#004643] text-white">
          <div className="text-xl font-bold">Zuno</div>
          <div className="flex items-center space-x-4">
            <select className="hover:bg-[#195b52] bg-[#004643] text-white p-2 rounded">
              <option>Project</option>
              <option>Project 2</option>
              <option>Project 3</option>
            </select>
            <div className="flex space-x-2">
              <a href="/zuno-chat" className="p-2 rounded hover:bg-[#195b52] flex items-center">
                <span className="material-icons">Ideate</span>
              </a>
              <a href="/task-board" className="p-2 rounded hover:bg-[#195b52] flex items-center">
                <span className="material-icons">Task Board</span>
              </a>
              <a href="/work-space" className="p-2 rounded hover:bg-[#195b52] flex items-center">
                <span className="material-icons">Work Space</span>
              </a>
            </div>
            <button className="p-2 rounded hover:bg-[#195b52]">
              <span className="material-icons">account</span>
            </button>
            <button className="p-2 rounded hover:bg-[#195b52]">
              <span className="material-icons">settings</span>
            </button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
