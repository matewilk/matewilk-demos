import Image from "next/image";

const callouts = [
  {
    name: "Web3 Wallet",
    description: "Web3 wallet with ERC20 token support",
    imageSrc: "/images/web3_wallet.png",
    imageAlt: "Web3 wallet with ERC20 token support",
    href: "/wallet",
  },
  {
    name: "Websocket Chat",
    description: "Apollo Subscription based websocket chat",
    imageSrc: "/images/chat.png",
    imageAlt: "Apollo Subscription based websocket chat",
    href: "/chats",
  },
];

export default function Demos() {
  return (
    <div className="frosted rounded-xl p-4">
      <div className="top mb-1 flex">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="ml-2 h-3 w-3 rounded-full bg-orange-300"></div>
        <div className="ml-2 h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <div className="mt-6 space-y-12 py-5 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:space-y-0">
        {callouts.map((callout) => (
          <div key={callout.name} className="group relative">
            <div className="sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative h-80 w-full overflow-hidden rounded-lg group-hover:opacity-75 sm:h-64">
              <Image
                layout="fill"
                src={callout.imageSrc}
                alt={callout.imageAlt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h3 className="mt-6 text-sm text-slate-200">
              <a href={callout.href}>
                <span className="absolute inset-0" />
                {callout.name}
              </a>
            </h3>
            <p className="text-base font-normal text-slate-100">
              {callout.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
