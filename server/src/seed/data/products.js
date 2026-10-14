// Products reference collections by index into the collections seed array.
// The seed script resolves these indices into real ObjectIds after
// collections are inserted.

const colorways = ["Stone", "Umber", "Ash", "Bronze", "Ink", "Chalk"];

const productImage = (seed) => ({
  url: `https://images.unsplash.com/photo-${seed}?w=1200`,
  alt: "Wallcovering surface detail",
});

const imagePool = [
  "1517685633527-58b19a54b0d5",
  "1533090161767-e6ffed986c88",
  "1518709268805-4e9042af2176",
  "1509644851169-2acc08aa25b5",
  "1449247709967-d4461a6a6103",
  "1441974231531-c6227db76b6e",
  "1518495973542-4542c06a5843",
  "1494412574643-ff11b0a5c1c3",
  "1550684848-fac1c5b4e853",
  "1610701596007-11502861dcfa",
];

export function buildProducts(collections) {
  const products = [];
  let counter = 1;

  collections.forEach((collection, collectionIndex) => {
    const perCollection = 5;
    for (let i = 0; i < perCollection; i++) {
      const colorway = colorways[i % colorways.length];
      const image = imagePool[(collectionIndex + i) % imagePool.length];
      const code = `AS-${String(collectionIndex + 1).padStart(2, "0")}${String(i + 1).padStart(2, "0")}`;

      products.push({
        name: `${collection.name} — ${colorway}`,
        productCode: code,
        collectionIndex,
        material: collection.materials[i % collection.materials.length],
        category: collection.category,
        applications: collection.applications,
        tags: [collection.name.toLowerCase(), colorway.toLowerCase(), collection.category],
        color: colorway,
        dimensions: {
          widthCm: 91,
          rollLengthM: 10,
          repeatCm: [0, 32, 64][i % 3],
        },
        technicalInfo:
          "Water-based inks on FSC-certified substrate. Class A fire rating. Suitable for commercial installation with appropriate adhesive.",
        finishes: ["Matte", "Textured"],
        images: [productImage(image)],
        technicalSheetUrl: "",
      });
      counter++;
    }
  });

  return products;
}
