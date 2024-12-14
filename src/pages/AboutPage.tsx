import creatorImage from "@/assets/Creator.png";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { NavLink } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="w-screen h-full flex flex-col items-center justify-center">
      <div className="flex flex-row justify-between sticky top-0 h-16 items-center gap-2 w-full p-2 bg-white">
        <NavLink to="/">
          <h2 className="text-3xl font-bold">Convo</h2>
        </NavLink>
        <div>
          <NavLink to="/app">
            <Button>Get Convo</Button>
          </NavLink>
        </div>
      </div>

      <main className="flex flex-col items-center gap-8 py-8">
        <h1 className="text-5xl font-semibold gamja-flower">
          Hey, thanks for stopping by.
        </h1>
        <div className="flex flex-row justify-center items-center px-20 bg-red-200 flex-wrap py-8">
          <div className="flex flex-col items-center sm:w-[80%] md:w-[40%]">
            <h1 className="text-3xl font-semibold gamja-flower">I'm Hannah.</h1>
            <p className="text-center">
              I'm a freshly graduated software engineering student. I'm going to
              be working at Canva, so I want to freshen up on my design and
              development skills to be able to perform at the best of my
              ability.
            </p>
          </div>
          <img src={creatorImage} className="w-[350px]" />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold gamja-flower">About Convo</h1>
          <p className="text-center w-[60%]">
            Convo is a personal project aimed at creating a straightforward
            note-taking platform. Drawing inspiration from OneNote, it organises
            notes into Notebooks, reflecting how I prefer structuring my
            handwritten notes in physical notebooks.
          </p>

          <p className="text-center w-[60%]">
            Currently, the app stores your notes in your browser's storage,
            which may limit the amount of saved content. Expanding this storage
            solution is part of the development roadmap. Stay tuned! :)
          </p>
        </div>

        <h2 className="text-xl font-medium">Roadmap 🚀</h2>
        <p className="text-sm text-muted-foreground ">
          This might not be the perfectly ordered roadmap, but it's a list of
          features I plan to implement... I can be a bit sporadic.
        </p>
        <Table className="w-[70%] mx-auto">
          <TableCaption>Feature List 💃</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{row.feature}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

const tableData = [
  {
    feature: "Basic Notebooks, Sections and Pages",
    status: "✅",
    notes: "Users can create notebooks with various sections and pages.",
  },
  {
    feature: "Markdown Notes",
    status: "✅",
    notes: "Users can write markdown style notes on a clean text editor.",
  },
  {
    feature: "Nested Pages",
    status: "✅",
    notes: "Pages can have an infinite number of child pages",
  },
  {
    feature: "Sortable Page Tree",
    status: "✅",
    notes: "Move around and re-order your pages freely.",
  },
  {
    feature: "Resizable and Collapsible Sidebars",
    status: "✅",
    notes: "Modify preferred UI by providing collapsible sidebars.",
  },
  {
    feature: "Search Notes",
    status: "👩‍💻",
    notes: "A modal to search pages and sections.",
  },
  {
    feature: "Themes",
    status: "👩‍💻",
    notes: "Supercool customisable themes.",
  },
  {
    feature: "Infinite Canvas Pages",
    status: "👩‍💻",
    notes: "Pages can either be markdown notes or an infintie-canvas.",
  },
  {
    feature: "Large Local Database",
    status: "👩‍💻",
    notes:
      "Improve the local data capacity by either embedding a database, or integrating with a live back-end.",
  },
  {
    feature: "Website Parser",
    status: "👩‍💻",
    notes:
      "Input a website URL to parse its content into your notes, and viewing it as an editable Text Page.",
  },
  {
    feature: "Cloud Integration",
    status: "👩‍💻",
    notes:
      "Back-up and save your notes to an existing cloud storage provider such as Google Drive, Dropbox, or OneDrive.",
  },
  {
    feature: "Host on Github Pages",
    status: "👩‍💻",
    notes: "Open access to the internet via Github Pages!",
  },
  {
    feature: "Self-host",
    status: "👩‍💻",
    notes: "Host the platform on my own server!",
  },
];

export default AboutPage;
