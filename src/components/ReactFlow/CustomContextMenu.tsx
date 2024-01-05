export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: {
  id: string
  top: number
  left: number
  right: number
  bottom: number
  props?: any
}) {
  console.log('ContextMenu', id, top, left, right, bottom, props)

  return (
    <div
      //   style={{ top, left, right, bottom }}
      className={`absolute z-10 flex flex-col rounded-xl bg-white shadow-lg top=${top} left=${left} right=${right} bottom=${bottom}`}
      {...props}
    >
      <p className="m-2 text-sm font-semibold text-gray-500">
        <small>{id}</small>
      </p>
      <button className="gap-x-1.5 rounded-xl bg-pink-500 px-2.5 px-4 py-1.5 py-2 text-sm font-bold font-semibold text-white text-white">
        hello world 2
      </button>
    </div>
  )
}
