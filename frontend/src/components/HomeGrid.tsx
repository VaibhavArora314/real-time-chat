interface GridElement {
  id: number;
  src: string;
  alt?: string;
  label: string;
}

const gridElements: GridElement[] = [
  {
    id: 1,
    src: "demo/createGroup.png",
    alt: "Creating group",
    label: "Create a group",
  },
  {
    id: 2,
    src: "demo/inviteCode.png",
    alt: "sending invites",
    label: "Send group invites to your friends",
  },
  {
    id: 3,
    src: "demo/joinGroup.png",
    alt: "Joining group",
    label: "Join groups via invite code",
  },
  {
    id: 4,
    src: "demo/chat.png",
    alt: "Chatting",
    label: "Volla! You can start chatting now!",
  },
];

const HomeGrid = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto flex-col items-center justify-between px-6">
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-4">
            How it works?
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {gridElements.map((gridElement) => (
            <div key={gridElement.id} className="p-4 text-lg text-center">
              <img
                src={gridElement.src}
                alt={gridElement.alt}
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-gray-700">{gridElement.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeGrid;
