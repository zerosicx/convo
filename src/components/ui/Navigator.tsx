import { notebooks, pages, sections } from '@/lib/dummyData';
import { cn } from '@/lib/utils';
import { BookText, Droplets, PlusCircle, Search } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';
import { NavGroup, NavGroupContent, NavGroupItem, NavGroupTrigger } from './NavGroup';

export const Navigator = () => {
    return (
        <div className="flex flex-row gap-0">
            <NavBar />
            <PageBar />
        </div>
    )
}

const NavBar = () => {

    const params = useParams();

    const getSectionsByNotebook = (notebookId: string) => {
        return sections.filter((s) => s.notebookId === notebookId);
    }

    return (
        <Sidebar>
            <header className="flex flex-row gap-4 items-center px-4"><Droplets className="text-blue-500" /><h2 className="text-2xl">Mizu</h2></header>
            <div className="px-4">
                <Input startIcon={Search} placeholder='Search' className="bg-zinc-50" />
            </div>
            <div className="flex flex-col w-full px-4 items-start">
                <Label className="text-sm text-muted-foreground">NOTEBOOKS</Label>
                <NavGroup type="multiple" className="w-full">
                    {
                        notebooks.map((notebook, index) => {
                            return (
                                <NavGroupItem value={notebook.id} key={index}>
                                    <NavGroupTrigger>
                                        <div className="flex flex-row gap-2 items-center">
                                            <BookText className="w-4 h-4" />
                                            <span className=" max-w-36 truncate" title={notebook.name}>{notebook.name}</span>
                                        </div>
                                    </NavGroupTrigger>
                                    <NavGroupContent className="flex flex-col gap-2 ml-4">
                                        {
                                            getSectionsByNotebook(notebook.id).map((section, index) => {
                                                return (
                                                    <NavLink to={`notebook/${notebook.id}/section/${section.id}`} key={index}>
                                                        <div className={cn("text-left p-2 text-primary",
                                                            params.sectionId === section.id && "bg-zinc-200"
                                                        )}
                                                            style={{ borderLeft: `2px solid ${section.color}` }}>
                                                            {section.name}
                                                        </div>
                                                    </NavLink>
                                                )
                                            })
                                        }
                                    </NavGroupContent>
                                </NavGroupItem>
                            )
                        })
                    }
                </NavGroup>
            </div>
        </Sidebar>
    )
}

const PageBar = () => {
    // Only display if there are params showing

    const params = useParams();
    console.log(params);

    if (!params || !params.sectionId) return;

    // We know for sure section exists, so get the pages under a specific section
    const sectionId = params.sectionId;
    const pageList = pages.filter((p) => p.sectionId === sectionId);

    // Use regex to match the notebook id; temporary while UUID4 is not implemented
    const getNotebookId = (path: string) => {
        const notebookIdRegex = /^notebook-\d+/;
        const matches = path.match(notebookIdRegex);
        return matches ? matches[0] : "";
    }

    // TODO: use this regex expression when UUID is implemented
    // const notebookIdRegex = /^notebook-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;

    // TODO: use recursion to render nested pages
    return (
        <Sidebar>
            <div className="p-4 pb-0 flex flex-row justify-between">
                <Button>Add Note <PlusCircle /></Button>
            </div>
            <main>
                {
                    pageList.map((page, index) => {
                        return (
                            <NavLink to={`notebook/${getNotebookId(page.path)}/section/${sectionId}/page/${page.id}`} key={index}>
                                <div className={cn("text-left p-2 text-primary",
                                    params.pageId === page.id && "bg-blue-200"
                                )}>
                                    <h4 className="max-w-48 truncate">{page.title}</h4>
                                </div>
                            </NavLink>
                        )
                    })
                }
            </main>
        </Sidebar>
    )
}

const Sidebar = ({ children }: {
    children: React.ReactNode,
}) => {
    return (
        <div className="w-[15vw] min-w-60 h-screen bg-zinc-100 border-r border-zinc-300 flex flex-col gap-4">
            {children}
        </div>
    )
}

export default Navigator