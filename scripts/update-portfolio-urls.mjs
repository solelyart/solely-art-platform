import mysql from 'mysql2/promise';

// Portfolio images mapping with CDN URLs for each artist
const artistPortfolios = {
  // Elena Martinez (ID 150007) - Portrait & Fine Art Painter
  150007: [
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/LfVBzlvWdmqoMKkX.jpeg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/wngUhsZEWsbJkNcw.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/iYXZxDoSRJvWIgiz.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/FBSIyPRfUxKOAoPH.jpg',
  ],
  // Marcus Chen (ID 150008) - Digital Artist & Illustrator
  150008: [
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/SyvmqVoiIhEgYWHt.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/vntjqlfzKvcKmeii.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/YxZMSHzgMSnsmpjs.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/aQLcqxUkACEubSqM.jpg',
  ],
  // Sophia Anderson (ID 150009) - Landscape & Nature Photographer
  150009: [
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/hOeSDsfqtpgxVaFB.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/LCgUcPUDZgaMNjGb.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/bvCwfYZRMYfXuIHa.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/cgUfCmncnEqkGofq.jpg',
  ],
  // James Rodriguez (ID 150010) - Watercolor & Traditional Artist
  150010: [
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/niGdfvcyBEcGxZfO.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/OhBllitMAOafmSVJ.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/UTMURuoYCmciWlfd.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/JQVRyMqTtkIWhHFX.jpg',
  ],
  // Aria Thompson (ID 150011) - Contemporary & Mixed Media
  150011: [
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/RKGaNqUdFyfocpIW.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/fqHnIiJgvuNvqmpJ.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/AWxFsAFEnusNmZgM.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/FEbyrUhZjeuzYInx.jpg',
  ],
  // Oliver Kim (ID 150012) - Photography & Visual Arts
  150012: [
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/XsqslkyVmscOlsgy.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/xhcfGsVFvYpoPlKM.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/wMGnjLKAikeFzmce.jpg',
    'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/RxNeeYaUPkoLwNRd.webp',
  ],
};

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Updating Portfolio Images ===\n');

  for (const [artistId, urls] of Object.entries(artistPortfolios)) {
    const portfolioJson = JSON.stringify(urls);
    await connection.execute(
      `UPDATE artistProfiles SET portfolioImages = ? WHERE userId = ?`,
      [portfolioJson, artistId]
    );
    console.log(`✅ Updated artist ID ${artistId} with ${urls.length} images`);
  }

  // Verify the updates
  const [profiles] = await connection.execute(`
    SELECT userId, displayName, portfolioImages 
    FROM artistProfiles 
    WHERE userId IN (150007, 150008, 150009, 150010, 150011, 150012)
  `);
  
  console.log('\n=== Portfolio Summary ===');
  profiles.forEach(p => {
    const images = p.portfolioImages ? JSON.parse(p.portfolioImages) : [];
    console.log(`${p.displayName}: ${images.length} images`);
  });

  await connection.end();
  console.log('\n=== Portfolio update complete ===');
}

main().catch(console.error);
