"use client";
import React, { useEffect } from "react";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { ActionContext } from "@/context/ActionContext";
import { useContext } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function SandPackPreviewClient() {
  const previewRef = React.useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    GetSandpackClient();
  }, [sandpack, action]);

  const downloadAsZip = async () => {
    try {
      const zip = new JSZip();
      const { files } = sandpack;

      // Add all files to the zip
      Object.entries(files).forEach(([filename, fileContent]) => {
        // Remove leading slash if present
        const cleanFilename = filename.startsWith("/")
          ? filename.substring(1)
          : filename;

        // Get the file content (handle both string and object format)
        const content =
          typeof fileContent === "string" ? fileContent : fileContent.code;

        zip.file(cleanFilename, content);
      });

      // Add package.json if not already included
      if (!files["/package.json"] && !files["package.json"]) {
        const packageJson = {
          name: "sandpack-export",
          version: "1.0.0",
          description: "Exported from Sandpack",
          dependencies: sandpack.customSetup?.dependencies || {},
          scripts: {
            start: "react-scripts start",
            build: "react-scripts build",
          },
        };
        zip.file("package.json", JSON.stringify(packageJson, null, 2));
      }

      // Generate and download the zip file
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `sandpack-project-${Date.now()}.zip`);

      console.log("Project exported successfully!");
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("Failed to export project. Please try again.");
    }
  };

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();
    if (client && action) {
      console.log("Client", client);

      if (action?.actionType === "deploy") {
        const result = await client.getCodeSandboxURL();
        console.log(result);
        window.open(`https://${result?.sandboxId}.csb.app/`, "_blank");
      } else if (action?.actionType === "export") {
        // Download as ZIP instead of opening CodeSandbox
        await downloadAsZip();
      }

      // Reset action after handling
      setAction(null);
    }
  };

  return (
    <SandpackPreview
      style={{ height: "80vh" }}
      ref={previewRef}
      showNavigator
    />
  );
}

export default SandPackPreviewClient;
