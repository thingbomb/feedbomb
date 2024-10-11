"use client";
export default function FeedItem(props) {
  return (
    <button
      className={
        "flex gap-4 items-center cursor-pointer select-none hover:bg-[#FFFFFF14] active:bg-[#FFFFFF1A] p-2 rounded-lg w-full" +
        (props.selector === props.url ? " !bg-[#7C3AED]" : "")
      }
      tabIndex={0}
      {...props}
    >
      {props.children}
    </button>
  );
}
