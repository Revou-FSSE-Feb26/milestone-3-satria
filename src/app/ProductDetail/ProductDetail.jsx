export default function ProductDetail({ title, description, image }) {
    return (
        <div className="product-detail">
            <img src={image} alt={title} />
            <h1 className="product-title">{title}</h1>
            <p className="product-description">{description}</p>
        </div>
    );
}
