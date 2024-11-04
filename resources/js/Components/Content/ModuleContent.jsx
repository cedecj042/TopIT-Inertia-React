import { extractList, replaceSemicolonsWithCommas, textToArray } from "@/Library/utils";
import CollapseContent from "./CollapseContent";


export default function ModuleContent({ data }) {
    // Group headers with corresponding text
    const groupedContent = [];
    let currentHeader = null;
    let headerCounter = 1; // To create unique headers when needed

    data.attachments.forEach((item) => {
        if (item.type === "Header") {
            // When a header is found, store it temporarily
            currentHeader = { header: item.description, text: null };
        } 
        else if (item.type === "Text") {
            // If a text is found but no current header exists, create a sample header
            if (!currentHeader) {
                currentHeader = {
                    header: `Sample Header ${headerCounter}`,
                    text: null,
                };
                headerCounter++; // Increment to create unique sample headers
            }
            if(currentHeader.header === "Keywords"){
                const keywords = textToArray(item.description);
                currentHeader.text= keywords;
            }else if (currentHeader.header.toLowerCase() === "learning objectives"){
                const objectives = extractList(item.description);
                currentHeader.text = objectives;
            }else {
                currentHeader.text = replaceSemicolonsWithCommas(item.description);
            }
            
            groupedContent.push(currentHeader);

            // Reset current header after pairing
            currentHeader = null;
        }
        console.log(item)
    });

    console.log(groupedContent)

    return (
        <>
            {groupedContent.map((pair, index) => {
                return (
                    <div key={index} className="">
                        <CollapseContent id={index} header={pair.header}> 
                            {pair.header.toLowerCase() === "learning objectives" ? (
                                <ul>
                                    {pair.text.map((objective, i) => (
                                        <li key={i} className="text-content">
                                            {objective}
                                        </li>
                                    ))}
                                </ul>
                            ) : pair.header.toLowerCase() === "keywords" ? (
                                <div>
                                    {pair.text.map((keyword, i) => (
                                        <span key={i} className="badge rounded-pill bg-dark-subtle text-dark   m-1 fw-regular p-2">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-content">{pair.text}</p>
                            )}
                        </CollapseContent>
                        
                    </div>
                );
            })}
        </>
    );
}
