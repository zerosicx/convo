import { NotebookId, Section } from '@/lib/definitions'
import { useSectionStore } from '@/lib/stores/section-store'
import { cn } from '@/lib/utils'
import { Pencil, PlusCircle } from 'lucide-react'
import { ElementRef, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button } from '../Button'
import { Input } from '../Input'


const SectionItem = ({ notebookId, section, selected }:
    {
        notebookId: NotebookId,
        section: Section,
        selected: boolean
    }
) => {
    return (
        <NavLink to={`notebook/${notebookId}/section/${section.id}`}>
            <div className={cn("text-left p-1 text-primary flex flex-row justify-between items-center",
                selected && "bg-blue-200"
            )}
                style={{ borderLeft: `2px solid ${section.color}` }}>
                {section.name}
                <Button size="icon" variant="ghost">
                    <Pencil className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
        </NavLink>
    )
}
export const SectionTree = ({ notebookId }: { notebookId: NotebookId }) => {

    const params = useParams();
    const { sections, createSection } = useSectionStore();
    const [creatingSection, setCreatingSection] = useState<boolean>(false);
    const sectionInputRef = useRef<ElementRef<"input">>(null);


    const getSectionsByNotebook = (notebookId: string) => {
        return Object.values(sections).filter((s) => s.notebookId === notebookId);
    }

    const createNewSection = (notebookId: NotebookId, name: string) => {
        createSection(notebookId, name, "1");
        setCreatingSection(false);
    }
    return (
        <>
            {
                getSectionsByNotebook(notebookId).map((section, index) => {
                    return (
                        <SectionItem notebookId={notebookId} section={section} selected={params.sectionId === section.id} key={index} />
                    )
                })
            }
            {
                creatingSection ? <div className="w-full">
                    <Input ref={sectionInputRef} placeholder={"Untitled Section"} style={{ maxWidth: '100%' }} onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === "Enter") {
                            createNewSection(notebookId, sectionInputRef?.current?.value ?? "Untitled section");
                            setCreatingSection(false)
                        }
                    }}
                        onBlur={() => setCreatingSection(false)}
                    />
                </div> : <Button variant="ghost" className="w-full px-2 text-xs h-6 text-muted-foreground" onClick={() => setCreatingSection(true)}><PlusCircle /> Section</Button>
            }
        </>
    )
}

export default SectionItem