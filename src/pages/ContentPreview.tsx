import { useHandbookContext } from "../contexts/HandbookContext";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { useParams } from "react-router";
import { jsonToHTML } from "../lib/utils";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { api } from "../lib/api";

const ContentPreview = () => {
  const { sections, handbook } = useHandbookContext();
  const { id } = useParams();
  const sectionFromContext = sections.find((sec) => sec._id === id);
  const [section, setSection] = useState<Section | null>(
    sectionFromContext || null,
  );
  const [isLoadingSection, setIsLoadingSection] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  console.log(section);

  useEffect(() => {
    async function getSectionById() {
      if (!id) return;

      try {
        setIsLoadingSection(true);
        const res = await api.get(`/sections/${id}`);
        setSection(res.data.section);
      } catch (error) {
        // Keep context section as fallback if fetching the full section fails.
        setSection(sectionFromContext || null);
        console.error("Error loading section preview:", error);
      } finally {
        setIsLoadingSection(false);
      }
    }

    getSectionById();
  }, [id, sectionFromContext]);

  useEffect(() => {
    if (!section && sectionFromContext) {
      setSection(sectionFromContext);
    }
  }, [section, sectionFromContext]);

  if (isLoadingSection && !section) {
    return <p>Loading section...</p>;
  }

  if (!section) {
    return "No Section";
  }

  return (
    <ScrollArea className="bg-[#e5eaee] overflow-hidden">
      {/* Header */}
      <div
        className="text-white h-14 px-4 flex items-center"
        style={{ backgroundColor: (handbook as Handbook).color }}
      >
        <h1 className="text-sm font-semibold">{section?.title}</h1>
      </div>

      {/* Medias */}

      {section?.medias.length ? (
        <ScrollArea className="w-70 py-3 bg-black/10 ">
          <div className="px-4 w-full flex items-center justify-center space-x-4">
            {section?.medias.map((media) => {
              return (
                <div
                  key={media.url}
                  className={`w-56 overflow-hidden bg-white rounded-xl shadow ${section?.medias.length === 1 ? "mx-auto" : "aspect-12/8"}`}
                >
                  {media.type.startsWith("image") ? (
                    <img
                      src={media.url}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <ReactPlayer
                      src={media.url}
                      controls
                      width="100%"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}

            <div></div>
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        ""
      )}

      {/* Content Section */}
      <div className="w-full">
        <div className="w-full h-12 bg-white rounded-t-md overflow-hidden flex items-center justify-center border">
          <button
            className={`flex-1 text-xs h-full rounded-none bg-white ${activeTab === "content" ? "border-b-2 border-blue-500 text-blue-500" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`flex-1 text-xs h-full rounded-none bg-white ${activeTab === "summary" ? "border-b-2 border-blue-500 text-blue-500" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </div>

        {/* Actual Content */}

        {activeTab === "content" && (
          <div
            className={` 
          bg-white text-xs leading-5 p-4 tracking-wide text-justify space-y-4

          [&_p]:mb-[18px]

          [&_strong]:font-bold
          [&_em]:italic

          [&_ul]:pl-[22px] [&_ul]:mb-[16px] [&_ul]:list-disc
          [&_ol]:pl-[22px] [&_ol]:mb-[16px] [&_ol]:list-decimal

          [&_li]:mb-[8px]

          [&_h1]:text-[30px] [&_h1]:font-bold [&_h1]:mt-[12px] [&_h1]:mb-[16px]
          [&_h2]:text-[26px] [&_h2]:font-bold [&_h2]:mt-[10px] [&_h2]:mb-[14px]
          [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:mt-[8px] [&_h3]:mb-[12px]
          [&_h4]:text-[20px] [&_h4]:font-semibold [&_h4]:mt-[6px] [&_h4]:mb-[10px]
          [&_h5]:text-[18px] [&_h5]:font-semibold [&_h5]:mb-[8px]
          [&_h6]:text-[16px] [&_h6]:font-semibold [&_h6]:mb-[6px]

          [&_a]:text-blue-500 [&_a]:underline
        `}
            dangerouslySetInnerHTML={{
              __html: section.content
                ? jsonToHTML(section?.content)
                : "<p>No content available.</p>",
            }}
          />
        )}

        {activeTab === "summary" && (
          <div className="bg-white text-xs leading-5 p-4 tracking-wide text-justify space-y-4">
            {section?.summaries?.length
              ? section?.summaries.map((summary, index) => (
                  <p
                    key={index}
                    className="border-l-2 pl-2"
                    style={{
                      borderColor: (handbook as Handbook).color,
                    }}
                  >
                    {summary}
                  </p>
                ))
              : "No summary available."}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ContentPreview;
