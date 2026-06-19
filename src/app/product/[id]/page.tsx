import ProductDetail from "../../ProductDetail/ProductDetail";
import { getProductById } from "../../../lib/api";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) return <p>Product Not Found.</p>;

    return <ProductDetail {...product} />;
}
