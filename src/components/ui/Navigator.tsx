import { Page } from '@/lib/definitions';
import { notebooks, pages, sections } from '@/lib/dummyData';
import { cn } from '@/lib/utils';
import { BookText, ChevronDown, ChevronUp, Droplets, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';
import { NavGroup, NavGroupContent, NavGroupItem, NavGroupTrigger } from './NavGroup';
import { ScrollArea, ScrollBar } from './scroll-area';

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

    const params = useParams();

    if (!params || !params.sectionId) return;

    // We know for sure section exists, so get the pages under a specific section
    const sectionId = params.sectionId;

    return (
        <Sidebar>
            <div className="p-4 pb-0 flex flex-row justify-between">
                <Button>Add Note <PlusCircle /></Button>
            </div>
            <ScrollArea className="w-full h-full">
                <PageTree sectionId={sectionId} />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </Sidebar>
    )
}

const PageTree = ({ sectionId }: { sectionId: string }) => {

    const getTopLevelPagesFromSection = () => {
        return pages.filter((p) => p.level === 0 && p.sectionId === sectionId);
    }

    // TODO: use this regex expression when UUID is implemented
    // const notebookIdRegex = /^notebook-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;

    // TODO: use recursion to render nested pages
    return (
        <div>
            {
                getTopLevelPagesFromSection().map((page, index) => {
                    return (
                        <PageItem currentPage={page} key={index} />
                    )
                })
            }
        </div>
    )
}

const PageItem = ({ currentPage }: {
    currentPage: Page
}) => {
    const [open, setOpen] = useState<boolean>(false);
    // Get all the pages under the current level
    const params = useParams();
    const sectionId = params.sectionId;

    // Use regex to match the notebook id; temporary while UUID4 is not implemented
    const getNotebookId = (path: string) => {
        const notebookIdRegex = /^notebook-\d+/;
        const matches = path.match(notebookIdRegex);
        return matches ? matches[0] : "";
    }

    const getChildPages = () => {
        return pages.filter((p) => p.parentPageId === currentPage.id);
    }

    // Level will be a multiplier for nesting
    return (
        <div style={{ marginLeft: `${4 * currentPage.level}px` }}>
            <div className={cn("flex flex-row jusitfy-between w-full items-center", params.pageId === currentPage.id && "bg-blue-200")}>
                <NavLink to={`notebook/${getNotebookId(currentPage.path)}/section/${sectionId}/page/${currentPage.id}`} >
                    <div className={cn("text-left p-2 text-primary",
                    )}>
                        <h4 className="max-w-48 truncate">{currentPage.title}</h4>
                    </div>
                </NavLink >
                {
                    open && <Button size="icon" variant="ghost" onClick={() => { setOpen(!open) }}><ChevronUp className="w-4 h-4" /></Button>
                }
                {
                    !open && <Button size="icon" variant="ghost" onClick={() => { setOpen(!open) }}><ChevronDown className="w-4 h-4" /></Button>
                }
            </div>
            {
                open &&
                getChildPages().map((child, index) => {
                    return <PageItem currentPage={child} key={index} />
                })

            }
        </div>
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