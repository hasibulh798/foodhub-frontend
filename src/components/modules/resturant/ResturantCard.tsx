import Image from "next/image";
import Link from "next/link";

interface ProviderProps {
  id: string;
  businessName: string;
  address: string;
  logoUrl?: string | null;
  isVerified: boolean;
}

export default function RestaurantCard({
  id,
  businessName,
  address,
  logoUrl,
  isVerified,
}: ProviderProps) {

  return (
    <Link href={`/restaurants/${id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer overflow-hidden">
        
        {/* Logo / Cover */}
        <div className="h-44 w-full bg-gray-100 flex items-center  justify-center border-2 overflow-hidden">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              No Image
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {businessName}
            </h3>

            {isVerified && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {address}
          </p>
        </div>
      </div>
    </Link>
  );
}