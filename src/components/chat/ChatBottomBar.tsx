import { AnimatePresence, motion } from "framer-motion";
import {
  Ghost,
  ImageIcon,
  Loader,
  SendHorizonal,
  ThumbsUp,
} from "lucide-react";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import EmojiPicker from "./EmojiPicker";
import { Button } from "../ui/button";
import useSound from "use-sound";
import { usePreferences } from "@/store/usePreferences";

const ChatBottomBar = () => {
  const [message, setMessage] = useState<string>("");
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const isPending = false;
  const { soundEnabled } = usePreferences();
  const [PlaySound1] = useSound("/sounds/keystroke1.mp3");
  const [PlaySound2] = useSound("/sounds/keystroke2.mp3");
  const [PlaySound3] = useSound("/sounds/keystroke3.mp3");
  const [PlaySound4] = useSound("/sounds/keystroke4.mp3");

  const PlaySoundFunctions = [PlaySound1, PlaySound2, PlaySound3, PlaySound4];

  const PlayRandomKayStrokeSound = () => {
    const randomIndex = Math.floor(Math.random() * PlaySoundFunctions.length);
    {
      soundEnabled && PlaySoundFunctions[randomIndex]();
    }
  };
  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      {!message.trim() && (
        <ImageIcon size={20} className="cursor-pointer text-muted-foreground" />
      )}
      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
          className="w-full relative"
        >
          <Textarea
            autoComplete="off"
            placeholder="Aa"
            rows={1}
            className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background min-h-0"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              PlayRandomKayStrokeSound();
            }}
            ref={textAreaRef}
          />
          <div className="absolute right-2 bottom-0.5">
            <EmojiPicker
              onChange={(emoji) => {
                setMessage((prev) => prev + emoji);
                if (textAreaRef.current) {
                  textAreaRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>
        {message.trim() ? (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            variant={"ghost"}
            size={"icon"}
          >
            <SendHorizonal size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            variant={"ghost"}
            size={"icon"}
          >
            {!isPending && (
              <ThumbsUp size={20} className="text-muted-foreground" />
            )}
            {isPending && <Loader size={20} className="animate-spin" />}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBottomBar;
