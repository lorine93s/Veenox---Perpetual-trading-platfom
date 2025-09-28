import { Perp } from "@/feature/perp";

// export const dynamic = "force-static";

type ParamsProps = {
  params: {
    perp: string[];
  };
};

async function fetchAssetData({ params }: ParamsProps) {
  const options = { method: "GET" };

  const fetching = await fetch(
    `https://api-evm.orderly.org/v1/public/futures/${params.perp[0]}`,
    options
  ).then((response) => response.json());
  if (fetching.error) throw new Error(fetching.error);
  return fetching;
}

async function AssetPage({ params }: ParamsProps) {
  const { data } = await fetchAssetData({ params });
  return <Perp asset={data} />;
}

export default AssetPage;
