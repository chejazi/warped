export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://warped.art';

  const config = {
    accountAssociation: {
      header: 'eyJmaWQiOjE1NzMyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4YzE3MDUzMDFlY2ViZWRiM2Y4NWNiNzkzMzBhODU1Yjg0N2Y4MDAxNiJ9',
      payload: 'eyJkb21haW4iOiJ3YXJwZWQuYXJ0In0',
      signature: 'MHg5MzM0MTVhNjZmMzNiOTE2YjM3MDNlZTdhMDdhN2UxNWI3YTFhNjNiNjg0YzA0NWU2NTM0NWJlODQ3OGU3ZjI0Nzg2ZWEwOTI2YTZlNTAzODhmZjMyYmJiMWQzM2E2ZGQ1YTExYTZmNDM1YTA2ZDU0NDlhYjlkNTQ3NDJjZGRlMTFj'
    },
    frame: {
      version: "1",
      name: "Warped",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image`,
      buttonTitle: "Launch",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#1300ff",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
