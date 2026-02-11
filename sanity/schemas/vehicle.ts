import { defineField, defineType } from "sanity";

export default defineType({
  name: "vehicle",
  title: "Véhicule",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Marque",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "model",
      title: "Modèle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: {
        source: (doc) => `${doc.brand}-${doc.model}`,
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Année",
      type: "number",
      validation: (rule) => rule.required().min(1990).max(2030),
    }),
    defineField({
      name: "price",
      title: "Prix (€)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "mileage",
      title: "Kilométrage",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "fuel",
      title: "Carburant",
      type: "string",
      options: {
        list: [
          { title: "Essence", value: "essence" },
          { title: "Diesel", value: "diesel" },
          { title: "Hybride", value: "hybride" },
          { title: "Électrique", value: "electrique" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
      options: {
        list: [
          { title: "Manuelle", value: "manuelle" },
          { title: "Automatique", value: "automatique" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type de véhicule",
      type: "string",
      options: {
        list: [
          { title: "Berline", value: "berline" },
          { title: "SUV", value: "suv" },
          { title: "Coupé", value: "coupe" },
          { title: "Break", value: "break" },
          { title: "Citadine", value: "citadine" },
          { title: "Utilitaire", value: "utilitaire" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "power",
      title: "Puissance (chevaux)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: {
        layout: "grid",
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Équipements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "Disponible", value: "available" },
          { title: "Réservé", value: "reserved" },
          { title: "Vendu", value: "sold" },
        ],
      },
      initialValue: "available",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Véhicule en vedette",
      description: "Afficher sur la page d'accueil",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isNew",
      title: 'Badge "Nouveau"',
      description: "Afficher le badge nouveau",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "soldDate",
      title: "Date de vente",
      type: "date",
      hidden: ({ document }) => document?.status !== "sold",
    }),
  ],
  preview: {
    select: {
      brand: "brand",
      model: "model",
      media: "images.0",
      status: "status",
    },
    prepare({ brand, model, media, status }) {
      const statusLabel: Record<string, string> = {
        available: "Disponible",
        reserved: "Réservé",
        sold: "Vendu",
      };
      return {
        title: `${brand} ${model}`,
        subtitle: statusLabel[status] || status,
        media,
      };
    },
  },
});
