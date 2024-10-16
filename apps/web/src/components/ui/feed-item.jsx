"use client";
export default function FeedItem(props) {
  return (
    <button
      className={
        "flex gap-4 items-center cursor-pointer select-none p-2 rounded-lg w-full feed-item " +
        (props.selector == props.url ? "selected-feed" : "")
      }
      tabIndex={0}
      {...props}
    >
      {props.children}
    </button>
  );
}
