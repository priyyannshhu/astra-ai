import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import React from "react";

function Workspace() {
  return (
    <>
      {/* Background Gradient Animation - same as Hero */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 0)"
        gradientBackgroundEnd="rgb(10, 10, 30)"
        firstColor="59, 130, 246"
        secondColor="139, 92, 246"
        thirdColor="96, 165, 250"
        fourthColor="147, 51, 234"
        fifthColor="79, 70, 229"
        pointerColor="99, 102, 241"
        size="80%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="fixed inset-0 -z-10"
      />

      {/* Workspace Content */}
      <div className="p-3 pr-5 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ChatView />
          <div className="col-span-2">
            <CodeView />
          </div>
        </div>
      </div>
    </>
  );
}

export default Workspace;
