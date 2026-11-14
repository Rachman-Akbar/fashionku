<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Katalog produk Fashionku: 100 produk fashion realistis (pakaian, alas kaki,
 * tas, aksesori) lengkap dengan varian ukuran, harga normal/diskon, stok,
 * atribut material, galeri foto, riwayat stok awal, dan voucher aktif.
 *
 * Data ditulis manual (nama koleksi, brand, material, dan deskripsi khas
 * butik fashion Indonesia) agar tampilan toko terasa hidup, bukan data dummy.
 */
final class FashionProductsSeeder extends Seeder
{
    private const APPAREL_SIZES = 'S,M,L,XL';

    /**
     * Galeri foto Unsplash (sudah diverifikasi) per kategori leaf.
     *
     * @var array<string, list<string>>
     */
    private const IMAGE_POOLS = [
        'kaos' => ['1521572163474-6864f9cf17ab', '1523381210434-271e8be1f52b', '1555529669-e69e7aa0ba9a', '1618354691373-d851c5c3a990', '1576566588028-4147f3842f27', '1614252235316-8c857d38b5f4', '1516762689617-e1cffcef479d'],
        'kemeja' => ['1552374196-1ab2a1c593e8', '1591195853828-11db59a44f6b', '1602810318383-e386cc2a3ccf', '1519085360753-af0119f7cbe7', '1521119989659-a83eee488004', '1617137968427-85924c800a22', '1541099649105-f69ad21f3246'],
        'jaket' => ['1551028719-00167b16eac5', '1591047139829-d91aecb6caea', '1434389677669-e08b4cac3105', '1479064555552-3ef4979f8908', '1520975954732-35dd22299614', '1487222477894-8943e31ef7b2'],
        'celana-pria' => ['1541099649105-f69ad21f3246', '1594633312681-425c7b97ccd1', '1542272604-787c3835535d', '1516762689617-e1cffcef479d'],
        'dress' => ['1515372039744-b8f02a3ae446', '1566174053879-31528523f8ae', '1595777457583-95e059d581b8', '1598033129183-c4f50c736f10', '1620799140408-edc6dcb6d633', '1620799140188-3b2a02fd9a77', '1485968579580-b6d095142e6e'],
        'blus' => ['1485968579580-b6d095142e6e', '1525507119028-ed4c629a60a3', '1529139574466-a303027c1d8b', '1490481651871-ab68de25d43d', '1496217590455-aa63a8350eea', '1496747611176-843222e1e57c'],
        'rok' => ['1487222477894-8943e31ef7b2', '1512436991641-6745cdb1723f', '1515886657613-9f3515b0c78f', '1539109136881-3be0616acf4b', '1509631179647-0177331693ae'],
        'outer-wanita' => ['1434389677669-e08b4cac3105', '1479064555552-3ef4979f8908', '1509631179647-0177331693ae', '1520975954732-35dd22299614', '1490481651871-ab68de25d43d'],
        'sepatu' => ['1460353581641-37baddab0fa2', '1503341504253-dff4815485f1', '1542291026-7eec264c27ff', '1543076447-215ad9ba6923', '1549298916-b41d501d3772', '1560343090-f0409e92791a', '1595341888016-a392ef81b7de', '1600185365483-26d7a4cc7519', '1600269452121-4f2416e55c28', '1608231387042-66d1773070a5', '1552346154-21d32810aba3', '1556906781-9a412961c28c', '1560769629-975ec94e6a86', '1596755094514-f87e34085b2c', '1610701596007-11502861dcfa', '1525966222134-fcfa99b8ae77', '1567401893414-76b7b1e5a7a5', '1543163521-1bf539c55dd2'],
        'sandal' => ['1543163521-1bf539c55dd2', '1525966222134-fcfa99b8ae77', '1567401893414-76b7b1e5a7a5', '1560769629-975ec94e6a86'],
        'tas-ransel' => ['1622560480605-d83c853bc5c3', '1566150905458-1bf1fc113f0d', '1585487000160-6ebcfceb0d03', '1594223274512-ad4803739b7c', '1591561954557-26941169b49e'],
        'tas-selempang' => ['1475180098004-ca77a66827be', '1548036328-c9fa89d128fa', '1584917865442-de89df76afd3', '1590874103328-eac38a683ce7', '1591561954557-26941169b49e', '1566150905458-1bf1fc113f0d'],
        'dompet' => ['1475180098004-ca77a66827be', '1548036328-c9fa89d128fa', '1584917865442-de89df76afd3', '1594223274512-ad4803739b7c'],
        'jam-tangan' => ['1523170335258-f5ed11844a49', '1524805444758-089113d48a6d', '1546868871-7041f2a55e12', '1508057198894-247b23fe5ade', '1524592094714-0f0654e20314', '1602143407151-7111542de6e8', '1603252109303-2751441dd157', '1622445275576-721325763afe'],
        'kacamata' => ['1511499767150-a48a237f0083', '1572635196237-14b3f281503f', '1434493789847-2f02dc6ca35d', '1544441893-675973e31985'],
        'perhiasan' => ['1515562141207-7a88fb7ce338', '1535632066927-ab7c9ab60908', '1573408301185-9146fe634ad0', '1602173574767-37ac01994b2a', '1617038220319-276d3cfab638'],
    ];

    /**
     * [nama, slug, kategori leaf, brand, material, deskripsi, harga, harga diskon, ukuran varian]
     *
     * @var list<array{0: string, 1: string, 2: string, 3: string, 4: string, 5: string, 6: int, 7: int|null, 8: string}>
     */
    private const PRODUCTS = [
        ['Kaos Polos Cotton Combed 24s Hitam', 'kaos-polos-cotton-combed-24s-hitam', 'kaos', 'Basic Wear', 'Cotton Combed 24s', 'Kaos polos dengan bahan cotton combed 24s yang halus dan menyerap keringat. Jahitan rantai di bagian bahu menjaga bentuk tetap rapi setelah berkali-kali dicuci.', 89000, null, 'S,M,L,XL,XXL'],
        ['Kaos Oversize Drop Shoulder Cream', 'kaos-oversize-drop-shoulder-cream', 'kaos', 'Prego Studio', 'Cotton Fleece 20s', 'Potongan oversize dengan jatuh bahu yang santai, dijahit dari cotton fleece 20s yang tebal namun tetap breathable. Cocok untuk layering harian.', 159000, 129000, 'S,M,L,XL'],
        ['Kaos Lengan Panjang Heavyweight Doff Abu', 'kaos-lengan-panjang-heavyweight-doff-abu', 'kaos', 'Northline', 'Cotton Doff 30s', 'Lengan panjang dengan bahan doff yang tidak menerawang dan terasa tebal di badan. Manset rib menjaga pergelangan tetap kencang.', 179000, null, 'S,M,L,XL'],
        ['Kaos Raglan Cotton Blend Navy', 'kaos-raglan-cotton-blend-navy', 'kaos', 'Basic Wear', 'Cotton Blend', 'Kain raglan dengan garis kontras di lengan, bahan cotton blend yang elastis sehingga nyaman dipakai bergerak. Regular fit.', 119000, null, 'S,M,L,XL'],
        ['Kaos Premium Combed 30s Putih', 'kaos-premium-combed-30s-putih', 'kaos', 'Loom & Thread', 'Cotton Combed 30s', 'Kaos putih solid dengan permukaan halus dan tidak mudah kusut. Leher crew neck dengan rib 2x2 yang kuat.', 109000, 89000, 'S,M,L,XL'],
        ['Kaos Oversize Graphic Slow Living Sand', 'kaos-oversize-graphic-slow-living-sand', 'kaos', 'Prego Studio', 'Cotton Combed 24s', 'Desain sablon plastisol bertema slow living pada bahan sand yang lembut. Sablon tidak mudah pecah meski sering dicuci.', 169000, null, 'M,L,XL'],
        ['Kaos Turtle Neck Rib Hitam', 'kaos-turtle-neck-rib-hitam', 'kaos', 'Rue Atelier', 'Rib Viscose', 'Turtleneck rajut rib yang memeluk badan dan jatuh rapi. Bahan viscose memberi efek licin sejuk saat dipakai.', 189000, null, 'S,M,L'],
        ['Kaos Crop Boxy Sage', 'kaos-crop-boxy-sage', 'kaos', 'Rue Atelier', 'Cotton Slub', 'Potongan crop boxy dengan bahan slub bertekstur. Panjang badan berhenti tepat di pinggang untuk dipadukan dengan high waist.', 149000, 119000, 'S,M,L'],
        ['Kaos Polo Knit Sand', 'kaos-polo-knit-sand', 'kaos', 'Kinship Club', 'Knit Pique', 'Polo rajut pique dengan dua kancing dan kerah kaku yang tetap berdiri. Breathable untuk cuaca tropis.', 199000, null, 'S,M,L,XL'],
        ['Kaos Undershirt Viscose Putih', 'kaos-undershirt-viscose-putih', 'kaos', 'Basic Wear', 'Viscose', 'Inner tipis dengan bahan viscose yang tidak bikin gerah, nyaman dipakai di balik kemeja. Jahitan flatlock anti gatal.', 79000, null, 'M,L,XL'],

        ['Kemeja Flannel Kotak Maroon', 'kemeja-flannel-kotak-maroon', 'kemeja', 'Northline', 'Flannel Brushed', 'Flannel brushed yang lembut dengan motif kotak klasik. Dua kantong dada dan kancing imitasi kayu.', 229000, 189000, 'S,M,L,XL'],
        ['Kemeja Oxford Slim Fit Putih', 'kemeja-oxford-slim-fit-putih', 'kemeja', 'Loom & Thread', 'Oxford Cotton', 'Kemeja oxford dengan potongan slim fit yang tetap nyaman di badan. Kerah button-down dan manset satu kancing.', 259000, null, 'S,M,L,XL'],
        ['Kemeja Linen Oversize Khaki', 'kemeja-linen-oversize-khaki', 'kemeja', 'Prego Studio', 'Linen Blend', 'Linen blend yang jatuh ringan dan sedikit transparan khas linen. Dipotong oversize dengan garis jahit kontras.', 289000, null, 'M,L,XL'],
        ['Kemeja Denim Washed Biru', 'kemeja-denim-washed-biru', 'kemeja', 'Urban Ridge', 'Denim 8 oz', 'Denim 8 oz dengan washing ringan, tidak kaku sejak pemakaian pertama. Cocok dipakai sebagai outer tipis.', 299000, 249000, 'S,M,L,XL'],
        ['Kemeja Batik Lengan Panjang Parang', 'kemeja-batik-lengan-panjang-parang', 'kemeja', 'Sekar Batik', 'Katun Primisima', 'Batik cap motif parang pada katun primisima yang halus. Kerah tegak dan potongan lurus klasik.', 349000, null, 'S,M,L,XL'],
        ['Kemeja Corduroy Cokelat Tua', 'kemeja-corduroy-cokelat-tua', 'kemeja', 'Kinship Club', 'Corduroy 8 Wale', 'Corduroy 8 wale dengan garis rapat yang hangat dipakai saat malam. Regular fit dengan kantong dada kiri.', 279000, null, 'M,L,XL'],
        ['Kemeja Twill Asimetri Navy', 'kemeja-twill-asimetri-navy', 'kemeja', 'Rue Atelier', 'Cotton Twill', 'Twill tebal dengan potongan asimetri di bagian bawah, menutupi pinggul. Kancing imitasi tanduk.', 269000, 219000, 'S,M,L'],
        ['Kemeja Camp Shirt Bunga Hutan', 'kemeja-camp-shirt-bunga-hutan', 'kemeja', 'Kinship Club', 'Rayon', 'Camp collar dengan print bunga hutan warna hijau tua. Bahan rayon yang jatuh dan tidak menerawang.', 249000, null, 'M,L,XL'],

        ['Jaket Denim Oversize Blue Washed', 'jaket-denim-oversize-blue-washed', 'jaket', 'Urban Ridge', 'Denim 12 oz', 'Denim 12 oz dengan potongan oversize, dua kantong dada dan yoke belakang. Semakin sering dipakai semakin nyaman.', 399000, 329000, 'S,M,L,XL'],
        ['Jaket Varsity Wool Blend Navy Cream', 'jaket-varsity-wool-blend-navy-cream', 'jaket', 'Kinship Club', 'Wool Blend', 'Body wol blend dengan lengan kulit sintetis, rib di manset dan pinggang. Patch bordir di dada kiri.', 549000, null, 'M,L,XL'],
        ['Jaket Bomber Ripstop Hitam', 'jaket-bomber-ripstop-hitam', 'jaket', 'Northline', 'Ripstop Nylon', 'Ripstop nylon yang ringan dan tahan angin, dengan lining mesh. Zip YKK dan dua kantong sisi.', 459000, null, 'S,M,L,XL'],
        ['Jaket Hiking Softshell Abu', 'jaket-hiking-softshell-abu', 'jaket', 'Alpine Supply', 'Softshell', 'Softshell tiga lapis tahan angin dan sinar UV, dengan hood yang bisa dilepas. Cocok untuk perjalanan luar ruang.', 599000, 499000, 'M,L,XL'],
        ['Jaket Kanvas Kerja Cokelat', 'jaket-kanvas-kerja-cokelat', 'jaket', 'Urban Ridge', 'Cotton Canvas 14 oz', 'Kanvas 14 oz yang tebal dan tahan lama, dengan empat kantong fungsional. Original fit, tidak terlalu longgar.', 429000, null, 'M,L,XL'],
        ['Jaket Harrington Cotton Navy', 'jaket-harrington-cotton-navy', 'jaket', 'Prego Studio', 'Cotton Twill', 'Harrington klasik dengan lining kotak-kotak, manset rib dan tali pinggang. Ringan untuk cuaca malam.', 379000, 319000, 'S,M,L,XL'],

        ['Celana Chino Slim Fit Khaki', 'celana-chino-slim-fit-khaki', 'celana-pria', 'Northline', 'Cotton Twill Stretch', 'Chino dengan sedikit stretch sehingga nyaman duduk lama. Pinggang regular dan ujung kaki sedikit menyempit.', 239000, 199000, '28,29,30,31,32,33'],
        ['Celana Jeans Straight Leg Indigo', 'celana-jeans-straight-leg-indigo', 'celana-pria', 'Urban Ridge', 'Denim 12 oz', 'Straight leg dengan raw hem, bahan denim 12 oz yang tidak melar di lutut. Lima kantong klasik.', 329000, null, '29,30,31,32,33,34'],
        ['Celana Cargo Ripstop Olive', 'celana-cargo-ripstop-olive', 'celana-pria', 'Alpine Supply', 'Cotton Ripstop', 'Kantong cargo enam sisi dengan penutup kancing, bahan ripstop yang kuat. Tali pengatur di bagian bawah kaki.', 359000, 299000, '30,31,32,33,34'],
        ['Celana Formal Wool Blend Hitam', 'celana-formal-wool-blend-hitam', 'celana-pria', 'Loom & Thread', 'Wool Blend', 'Wool blend halus dengan lipatan depan permanen, jatuh lurus tanpa perlu disetrika setiap hari.', 459000, null, '29,30,31,32,33'],
        ['Celana Training Sweatpant Grey', 'celana-training-sweatpant-grey', 'celana-pria', 'Prego Studio', 'French Terry', 'French terry yang lembut di dalam, dengan tali serut dan manset rib. Nyaman untuk latihan maupun santai.', 199000, null, 'M,L,XL'],
        ['Celana Panjang Kanvas Cokelat', 'celana-panjang-kanvas-cokelat', 'celana-pria', 'Urban Ridge', 'Cotton Canvas 10 oz', 'Kanvas 10 oz dengan siluet lurus dan tiga kantong. Warna akan memudar alami seiring lama pemakaian.', 279000, null, '30,31,32,33,34'],
        ['Celana Jeans Slim Stretch Black', 'celana-jeans-slim-stretch-black', 'celana-pria', 'Urban Ridge', 'Denim Stretch', 'Black denim dengan sedikit stretch, warna hitam pekat yang tidak mudah pudar. Slim fit dengan ujung kaki 15 cm.', 349000, 289000, '29,30,31,32,33,34'],

        ['Dress Midi Linen Krem', 'dress-midi-linen-krem', 'dress', 'Luna Atelier', 'Linen', 'Midi dress dengan bahan linen yang sejuk dan tali pinggang bisa dilepas. Panjang 110 cm dari bahu.', 329000, 279000, 'S,M,L,XL'],
        ['Dress Slip Satin Champagne', 'dress-slip-satin-champagne', 'dress', 'Rue Atelier', 'Satin Silk', 'Slip dress potongan bias dengan tali adjustable dan bahan satin yang jatuh licin. Perlu dipakai dengan inner.', 289000, null, 'S,M,L'],
        ['Dress Wrap Floral Sage', 'dress-wrap-floral-sage', 'dress', 'Sekar Studio', 'Viscose', 'Wrap dress dengan tali pinggang yang diikat di sisi, print floral warna sage yang lembut. Lengan tiga per empat.', 299000, null, 'S,M,L,XL'],
        ['Dress Shirt Midi Denim Light', 'dress-shirt-midi-denim-light', 'dress', 'Kinship Club', 'Denim 6 oz', 'Denim light wash dengan kancing depan penuh dan ikat pinggang. Bisa dipakai sebagai outer panjang.', 349000, null, 'M,L,XL'],
        ['Dress Maxi Katun Batik Parang', 'dress-maxi-katun-batik-parang', 'dress', 'Sekar Batik', 'Katun Primisima', 'Batik parang pada katun primisima dengan potongan maxi dan lengan pendek. Karet di bagian belakang pinggang.', 429000, 359000, 'S,M,L,XL'],
        ['Dress Bodycon Rib Hitam', 'dress-bodycon-rib-hitam', 'dress', 'Rue Atelier', 'Rib Knit', 'Rajut rib elastis yang mengikuti bentuk badan, panjang di atas lutut. Bahan tebal sehingga tidak menerawang.', 259000, null, 'S,M,L'],
        ['Dress Sundress Tiered Gingham', 'dress-sundress-tiered-gingham', 'dress', 'Luna Atelier', 'Cotton Gingham', 'Tiga tingkat kain gingham dengan tali bahu adjustable dan karet di punggung. Ringan untuk cuaca panas.', 239000, 199000, 'S,M,L'],
        ['Dress Kemeja Midi Khaki', 'dress-kemeja-midi-khaki', 'dress', 'Northline', 'Cotton Twill', 'Shirt dress dengan kancing depan, kantong dada dan ikat pinggang. Panjang midi dengan belahan samping.', 319000, null, 'S,M,L,XL'],
        ['Dress Off Shoulder Ruffle Terracotta', 'dress-off-shoulder-ruffle-terracotta', 'dress', 'Luna Atelier', 'Crepe', 'Off shoulder dengan lengan ruffle dan bahan crepe yang tidak mudah kusut. Ada karet di bagian dada.', 309000, 259000, 'S,M,L'],

        ['Blus Ruffle Satin Ivory', 'blus-ruffle-satin-ivory', 'blus', 'Luna Atelier', 'Satin', 'Ruffle di lengan dan bahu, bahan satin ivory yang elegan untuk acara formal. Kancing belakang tersembunyi.', 249000, 209000, 'S,M,L,XL'],
        ['Blus Kerah Peter Pan Putih', 'blus-kerah-peter-pan-putih', 'blus', 'Rue Atelier', 'Cotton Poplin', 'Kerah peter pan dengan aksen pita, bahan poplin yang tidak menerawang. Lengan panjang manset kancing.', 219000, null, 'S,M,L,XL'],
        ['Blus Oversized Poplin Navy', 'blus-oversized-poplin-navy', 'blus', 'Northline', 'Cotton Poplin', 'Potongan oversized dengan jatuh bahu, nyaman dipakai ke kantor maupun santai. Bisa dikancingkan penuh.', 229000, null, 'S,M,L,XL'],
        ['Blus Crop Boxy Cotton Pink', 'blus-crop-boxy-cotton-pink', 'blus', 'Prego Studio', 'Cotton Slub', 'Boxy crop dengan bahan slub bertekstur dan bahu jatuh. Panjang sampai pinggang, cocok untuk high waist.', 169000, 139000, 'S,M,L'],
        ['Blus Tie Front Viscose Dusty Blue', 'blus-tie-front-viscose-dusty-blue', 'blus', 'Rue Atelier', 'Viscose', 'Tie front yang bisa diikat di depan atau dibiarkan longgar. Viscose halus dengan lengan balon pendek.', 209000, null, 'S,M,L'],
        ['Blus Batik Cap Sleeve Cokelat', 'blus-batik-cap-sleeve-cokelat', 'blus', 'Sekar Batik', 'Katun Primisima', 'Batik cap warna cokelat dengan lengan pendek dan kerah shanghai. Potongan lurus yang nyaman dipakai bekerja.', 279000, 239000, 'S,M,L,XL'],
        ['Blus Knit Cropped Cream', 'blus-knit-cropped-cream', 'blus', 'Kinship Club', 'Knit Rib', 'Rajut rib cropped dengan lebar badan yang pas, cocok untuk layering bersama rok high waist.', 189000, null, 'S,M,L'],
        ['Blus Peplum Formal Hitam', 'blus-peplum-formal-hitam', 'blus', 'Loom & Thread', 'Crepe', 'Peplum di pinggang dengan bahan crepe yang jatuh rapi. Lengan tiga per empat untuk tampilan formal.', 269000, null, 'S,M,L,XL'],

        ['Rok Plisket Midi Hitam', 'rok-plisket-midi-hitam', 'rok', 'Luna Atelier', 'Plisket Polyester', 'Plisket permanen yang tidak mudah kusut, mid-rise dengan karet di pinggang belakang. Panjang 80 cm.', 229000, 189000, 'S,M,L,XL'],
        ['Rok Denim A-Line Mid Blue', 'rok-denim-a-line-mid-blue', 'rok', 'Urban Ridge', 'Denim 8 oz', 'A-line dengan kancing depan dan dua kantong samping. Denim 8 oz yang cukup tebal sehingga tidak transparan.', 269000, null, 'S,M,L,XL'],
        ['Rok Span Mini Kulot Hitam', 'rok-span-mini-kulot-hitam', 'rok', 'Rue Atelier', 'Span Twill', 'Potongan kulot pendek dengan bahan span twill yang elastis. Pinggang karet dan ada kantong samping.', 199000, null, 'S,M,L'],
        ['Rok Linen Panjang Sage', 'rok-linen-panjang-sage', 'rok', 'Luna Atelier', 'Linen Blend', 'Linen blend panjang dengan belahan depan dan tali pinggang dari kain yang sama. Jatuh ringan dan sejuk.', 279000, 239000, 'S,M,L,XL'],
        ['Rok Batik Lilit Motif Kawung', 'rok-batik-lilit-motif-kawung', 'rok', 'Sekar Batik', 'Katun Batik', 'Rok lilit dengan motif kawung dan ikat pinggang, panjang midi. Bisa disarungkan dengan atasan polos.', 259000, null, 'S,M,L,XL'],

        ['Blazer Oversized Linen Oat', 'blazer-oversized-linen-oat', 'outer-wanita', 'Luna Atelier', 'Linen Blend', 'Blazer longgar dengan satu kancing dan bantalan bahu tipis. Bisa dipakai sebagai outer kerja maupun kasual.', 429000, 359000, 'S,M,L,XL'],
        ['Cardigan Rajut Cropped Mocca', 'cardigan-rajut-cropped-mocca', 'outer-wanita', 'Kinship Club', 'Knit Wool Blend', 'Cardigan cropped dengan kancing mutiara imitasi, bahan rajut yang hangat namun tidak berat.', 299000, null, 'S,M,L'],
        ['Trench Coat Katun Khaki', 'trench-coat-katun-khaki', 'outer-wanita', 'Northline', 'Cotton Gabardine', 'Gabardine tahan angin dengan tali pinggang dan epaulette di bahu. Panjang di bawah lutut.', 649000, 549000, 'S,M,L,XL'],
        ['Bomber Satin Wanita Sage', 'bomber-satin-wanita-sage', 'outer-wanita', 'Rue Atelier', 'Satin', 'Bomber satin dengan rib di manset dan pinggang, ringan dan jatuh licin. Cocok untuk acara malam.', 379000, null, 'S,M,L'],
        ['Kimono Rayon Floral', 'kimono-rayon-floral', 'outer-wanita', 'Sekar Studio', 'Rayon', 'Kimono panjang dengan print floral, lengan lebar dan ikat pinggang. Bisa dipakai sebagai outer dress.', 329000, 279000, 'S,M,L,XL'],

        ['Sneakers Canvas Low Putih', 'sneakers-canvas-low-putih', 'sepatu', 'Stride Co.', 'Kanvas 12 oz', 'Kanvas 12 oz dengan sol karet vulkanisir dan insole empuk. Tahan lama untuk pemakaian harian.', 299000, 249000, '39,40,41,42,43,44'],
        ['Sneakers Chunky Retro Silver', 'sneakers-chunky-retro-silver', 'sepatu', 'Stride Co.', 'Mesh & Sintetis', 'Siluet chunky dengan panel mesh dan aksen silver metalik. Sol empat sentimeter yang empuk.', 449000, null, '39,40,41,42,43'],
        ['Sepatu Kulit Formal Oxford Hitam', 'sepatu-kulit-formal-oxford-hitam', 'sepatu', 'Northline Leather', 'Kulit Sapi', 'Kulit sapi full grain dengan jahitan Blake dan sol karet anti selip. Cocok untuk acara formal.', 749000, 649000, '40,41,42,43,44'],
        ['Loafers Kulit Sintetis Cokelat', 'loafers-kulit-sintetis-cokelat', 'sepatu', 'Northline Leather', 'Kulit Sintetis', 'Loafers slip-on dengan aksen bit di bagian depan. Sol empuk dan ringan untuk dipakai sehari-hari.', 379000, null, '39,40,41,42,43'],
        ['Pantofel Kulit Asli Navy', 'pantofel-kulit-asli-navy', 'sepatu', 'Northline Leather', 'Kulit Sapi', 'Pantofel dengan kulit sapi bertekstur halus dan sol kulit bertali karet. Bentuk klasik yang mudah dipadukan.', 649000, null, '40,41,42,43,44'],
        ['Boots Chelsea Kulit Cokelat', 'boots-chelsea-kulit-cokelat', 'sepatu', 'Alpine Supply', 'Kulit Suede', 'Suede dengan panel elastis di sisi, sol karet tebal dan tahan air ringan. Tinggi mata kaki.', 599000, 499000, '40,41,42,43,44'],
        ['Boots Hiking Waterproof Brown', 'boots-hiking-waterproof-brown', 'sepatu', 'Alpine Supply', 'Kulit Nabuk', 'Nabuk waterproof dengan membran kedap air dan sol bergerigi untuk cengkeraman di tanah basah.', 899000, null, '40,41,42,43,44'],
        ['Sneakers Running Knit Abu', 'sneakers-running-knit-abu', 'sepatu', 'Stride Co.', 'Knit Mesh', 'Upper knit seamless dengan midsole busa responsif. Ringan untuk lari pagi maupun latihan di gym.', 549000, 459000, '40,41,42,43,44'],
        ['Wedges Kanvas Krem', 'wedges-kanvas-krem', 'sepatu', 'Luna Atelier', 'Kanvas', 'Wedges tujuh sentimeter dengan tali mata kaki yang bisa dilepas. Ringan dan stabil untuk dipakai lama.', 359000, null, '37,38,39,40,41'],
        ['Heels Blok Tali Hitam', 'heels-blok-tali-hitam', 'sepatu', 'Rue Atelier', 'Kulit Sintetis', 'Heels blok delapan sentimeter dengan tali ankle dan ujung runcing. Sol dalam berbantalan empuk.', 399000, 329000, '36,37,38,39,40'],
        ['Sneakers Slip-On Denim', 'sneakers-slip-on-denim', 'sepatu', 'Urban Ridge', 'Denim', 'Slip-on kanvas denim dengan elastic di sisi, tanpa tali. Sol karet putih yang mudah dibersihkan.', 329000, null, '39,40,41,42,43,44'],
        ['Pantofel Wanita Nude', 'pantofel-wanita-nude', 'sepatu', 'Rue Atelier', 'Kulit Sintetis', 'Pantofel ujung membulat dengan blok lima sentimeter, warna nude yang mudah dipadukan. Cocok untuk bekerja.', 369000, 299000, '36,37,38,39,40'],

        ['Sandal Slide Puffy Hitam', 'sandal-slide-puffy-hitam', 'sandal', 'Stride Co.', 'EVA', 'Slide EVA ringan dengan tali empuk, tahan air dan cepat kering. Sol berlekuk anti selip.', 149000, 119000, '39,40,41,42,43,44'],
        ['Sandal Kulit Tali Silang Cokelat', 'sandal-kulit-tali-silang-cokelat', 'sandal', 'Northline Leather', 'Kulit Sapi', 'Tali silang dari kulit sapi asli dengan sol karet empuk. Aksen gesper logam di sisi.', 279000, null, '39,40,41,42,43'],
        ['Sandal Sport Outdoor Abu', 'sandal-sport-outdoor-abu', 'sandal', 'Alpine Supply', 'Polyester Webbing', 'Webbing polyester dengan tiga titik pengatur, sol karet bergerigi untuk medan berbatu.', 299000, 249000, '40,41,42,43,44'],
        ['Sandal Heels Tali Mocca', 'sandal-heels-tali-mocca', 'sandal', 'Rue Atelier', 'Kulit Sintetis', 'Heels tujuh sentimeter dengan tali tipis di pergelangan dan sol empuk. Warna mocca yang netral.', 329000, null, '36,37,38,39,40'],

        ['Tas Ransel Kanvas Vintage Khaki', 'tas-ransel-kanvas-vintage-khaki', 'tas-ransel', 'Wander Bag', 'Kanvas 16 oz', 'Kanvas 16 oz dengan alas kulit dan gesper kuningan. Kompartemen laptop 14 inci dan tiga kantong depan.', 359000, 299000, '-'],
        ['Ransel Laptop Water Repellent Hitam', 'ransel-laptop-water-repellent-hitam', 'tas-ransel', 'Wander Bag', 'Polyester 900D', 'Polyester 900D tahan air ringan dengan slot laptop 15 inci dan lubang USB. Punggung mesh yang breathable.', 429000, null, '-'],
        ['Ransel Roll Top Army', 'ransel-roll-top-army', 'tas-ransel', 'Alpine Supply', 'Cordura', 'Roll top Cordura dengan kapasitas 22 liter yang bisa diperbesar. Cocok untuk harian maupun perjalanan singkat.', 489000, 429000, '-'],
        ['Ransel Mini Nylon Cream', 'ransel-mini-nylon-cream', 'tas-ransel', 'Kinship Club', 'Nylon', 'Ransel mini dengan tali bahu bisa disembunyikan, bisa dipakai sebagai sling maupun backpack. Muat tablet 10 inci.', 249000, null, '-'],
        ['Ransel Kulit Cokelat', 'ransel-kulit-cokelat', 'tas-ransel', 'Northline Leather', 'Kulit Sapi', 'Kulit sapi full grain dengan hardware kuningan dan lining kanvas. Terlihat semakin bagus seiring usia pemakaian.', 549000, null, '-'],

        ['Tas Selempang Kanvas Natural', 'tas-selempang-kanvas-natural', 'tas-selempang', 'Wander Bag', 'Kanvas 12 oz', 'Kanvas natural dengan dua kantong depan dan tali adjustable. Muat dompet, ponsel, dan botol kecil.', 199000, 169000, '-'],
        ['Sling Cordura Hitam', 'sling-cordura-hitam', 'tas-selempang', 'Alpine Supply', 'Cordura 500D', 'Sling Cordura dengan buckle cepat dan tiga kompartemen. Bisa dipakai di depan atau belakang badan.', 269000, null, '-'],
        ['Tas Selempang Kulit Cokelat', 'tas-selempang-kulit-cokelat', 'tas-selempang', 'Northline Leather', 'Kulit Sapi', 'Kulit sapi dengan jahitan tangan dan gesper logam. Bentuk ramping yang cocok untuk pria maupun wanita.', 429000, 379000, '-'],
        ['Sling Ripstop Olive', 'sling-ripstop-olive', 'tas-selempang', 'Alpine Supply', 'Ripstop Nylon', 'Ripstop ringan dengan tali webbing tebal dan kantong tersembunyi di bagian punggung. Tahan air ringan.', 239000, null, '-'],
        ['Selempang Mini Quilted Cream', 'selempang-mini-quilted-cream', 'tas-selempang', 'Kinship Club', 'Nylon Quilted', 'Quilted ringan dengan tali rantai imitasi, muat ponsel dan kartu. Cocok untuk acara santai.', 219000, 189000, '-'],
        ['Messenger Kanvas Navy', 'messenger-kanvas-navy', 'tas-selempang', 'Wander Bag', 'Kanvas 14 oz', 'Messenger bag dengan penutup magnet dan kompartemen laptop 13 inci. Tali bahu bisa dilepas.', 309000, null, '-'],

        ['Dompet Kulit Lipat Hitam', 'dompet-kulit-lipat-hitam', 'dompet', 'Northline Leather', 'Kulit Sapi', 'Lipat dua dengan enam slot kartu dan dua ruang uang kertas. Kulit sapi yang mengeras seiring pemakaian.', 199000, 169000, '-'],
        ['Dompet Kulit Panjang Cokelat', 'dompet-kulit-panjang-cokelat', 'dompet', 'Northline Leather', 'Kulit Sapi', 'Model panjang dengan delapan slot kartu, ruang koin, dan tempat struk. Jahitan saddle stitch di pinggir.', 279000, null, '-'],
        ['Dompet Kartu Slim Navy', 'dompet-kartu-slim-navy', 'dompet', 'Northline Leather', 'Kulit Sapi', 'Dompet kartu tipis dengan empat slot dan ikat karet di tengah. Muat di kantong depan celana.', 149000, 119000, '-'],
        ['Dompet Kanvas Olive', 'dompet-kanvas-olive', 'dompet', 'Wander Bag', 'Kanvas 12 oz', 'Kanvas dengan lining tahan air dan tiga slot kartu. Bentuk lipat tiga yang ringkas.', 129000, null, '-'],

        ['Jam Tangan Minimalis Dial Putih', 'jam-tangan-minimalis-dial-putih', 'jam-tangan', 'Chrono Lite', 'Stainless & Kulit', 'Dial 36 mm bersih tanpa angka, strap kulit asli 18 mm. Mesin quartz Jepang dengan tahan air 3 ATM.', 429000, 359000, '-'],
        ['Jam Tangan Kulit Cokelat 38mm', 'jam-tangan-kulit-cokelat-38mm', 'jam-tangan', 'Chrono Lite', 'Stainless & Kulit', 'Kode 38 mm dengan indeks batang dan tanggal di posisi tiga. Kaca mineral anti gores.', 489000, null, '-'],
        ['Jam Tangan Digital Sport Hitam', 'jam-tangan-digital-sport-hitam', 'jam-tangan', 'Chrono Lite', 'Resin', 'Resin ringan dengan lampu LED, stopwatch, dan alarm. Tahan air 5 ATM untuk aktivitas air ringan.', 359000, 299000, '-'],
        ['Jam Tangan Mesh Steel Silver', 'jam-tangan-mesh-steel-silver', 'jam-tangan', 'Chrono Lite', 'Stainless Steel', 'Strap mesh milanese yang bisa disesuaikan tanpa alat. Dial silver dengan indeks kristal.', 529000, null, '-'],
        ['Jam Tangan Couple Set Rose Gold', 'jam-tangan-couple-set-rose-gold', 'jam-tangan', 'Chrono Lite', 'Stainless & Mesh', 'Satu set berisi dua ukuran (36 mm dan 40 mm) dengan lapisan rose gold. Cocok untuk hadiah pasangan.', 699000, 599000, '-'],

        ['Kacamata Wayfarer Hitam', 'kacamata-wayfarer-hitam', 'kacamata', 'Optic Nine', 'Acetate', 'Frame asetat dengan lensa UV400 dan engsel logam. Bentuk wayfarer yang cocok untuk hampir semua bentuk wajah.', 279000, 229000, '-'],
        ['Kacamata Bulat Frame Emas', 'kacamata-bulat-frame-emas', 'kacamata', 'Optic Nine', 'Metal', 'Frame logam tipis dengan lensa hijau G15. Ringan dan nyaman dipakai lama.', 329000, null, '-'],
        ['Kacamata Cat Eye Tortoise', 'kacamata-cat-eye-tortoise', 'kacamata', 'Optic Nine', 'Acetate', 'Cat eye dengan motif tortoise dan lensa gradasi cokelat. Ujung frame meruncing lembut.', 299000, 249000, '-'],

        ['Kalung Rantai Stainless Gold', 'kalung-rantai-stainless-gold', 'perhiasan', 'Aurum', 'Stainless 316L', 'Rantai Cuban link dengan lapisan emas PVD yang tidak mudah pudar. Panjang 50 cm dengan pengatur 5 cm.', 179000, 149000, '-'],
        ['Gelang Beads Natural Stone', 'gelang-beads-natural-stone', 'perhiasan', 'Aurum', 'Batu Alam', 'Batu alam 8 mm dengan tali elastis yang kuat. Setiap butir punya corak yang sedikit berbeda.', 129000, null, '-'],
        ['Anting Hoop Stainless Silver', 'anting-hoop-stainless-silver', 'perhiasan', 'Aurum', 'Stainless 316L', 'Hoop 2 cm dengan kait aman, ringan dan hypoallergenic. Cocok untuk pemakaian harian.', 99000, 79000, '-'],
    ];

    /**
     * Voucher aktif: [kode, nama, target, tipe, nilai, min belanja, maks diskon, limit, mulai, berakhir].
     *
     * @var list<array{0: string, 1: string, 2: string, 3: string, 4: int, 5: int, 6: int|null, 7: int, 8: int, 9: int}>
     */
    private const VOUCHERS = [
        ['FASHIONKU25', 'Potongan 25RB untuk Koleksi Baru', 'product', 'fixed', 25000, 200000, null, 500, -45, 75],
        ['GRATISONGKIR', 'Gratis Ongkir Se-Indonesia', 'shipping', 'fixed', 20000, 150000, 20000, 800, -60, 90],
        ['FKU10', 'Diskon 10% Semua Kategori', 'product', 'percentage', 10, 250000, 75000, 400, -30, 60],
        ['NEWCOMER50', 'Voucher Pembeli Baru 50RB', 'product', 'fixed', 50000, 300000, null, 300, -90, 45],
        ['WEEKENDSALE', 'Diskon Akhir Pekan 15%', 'product', 'percentage', 15, 350000, 120000, 250, -20, 30],
        ['BatikDay', 'Spesial Batik Nusantara 30RB', 'product', 'fixed', 30000, 250000, null, 200, -15, 40],
        ['SEPATU100', 'Potongan 100RB Kategori Sepatu', 'product', 'fixed', 100000, 600000, null, 120, -40, 50],
        ['FREESHIPMIN300', 'Bebas Ongkir Min. 300RB', 'shipping', 'fixed', 25000, 300000, 25000, 600, -120, 120],
    ];

    public function run(): void
    {
        $this->command?->info('Fashionku: membuat 100 produk katalog...');

        $now = now()->toDateTimeString();
        $actorId = FashionDemoSeeder::uuidFor('seller.utama');
        $leafIds = DB::table('categories')->pluck('id', 'slug');
        $attributeIds = DB::table('product_attributes')->pluck('id', 'slug');

        $variantTotal = 0;

        foreach (self::PRODUCTS as $index => [$name, $slug, $leaf, $brand, $material, $description, $price, $salePrice, $sizeRaw]) {
            $categoryId = $leafIds[$leaf] ?? null;
            $sizes = $sizeRaw === '-' ? ['Original'] : array_map('trim', explode(',', $sizeRaw));
            $price = (int) $price;
            $priceOriginal = $salePrice !== null ? $price : null;
            $priceFinal = $salePrice ?? $price;

            // Sebagian produk sengaja masih draft/arsip agar menu admin punya
            // variasi status, seperti katalog toko yang sedang berjalan.
            $status = match (true) {
                $index % 37 === 36 => 'archived',
                $index % 29 === 28 => 'draft',
                default => 'published',
            };

            // Produk terbaru masuk beberapa jam terakhir, sisanya tersebar
            // sampai sekitar 6 bulan ke belakang.
            $createdAt = $index < 8
                ? now()->subHours(2 + $index * 5)
                : now()->subDays(2 + ($index - 8) * 2)->setTime(8 + ($index % 10), ($index * 13) % 60);

            $productId = DB::table('products')->insertGetId([
                'primary_category_id' => $categoryId,
                'name' => $name,
                'slug' => 'fashionku-'.$slug,
                'description' => $description."\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.",
                'brand' => $brand,
                'thumbnail' => $this->imageUrl($leaf, $index, '900x900'),
                'status' => $status,
                'is_active' => $status !== 'archived',
                'allows_preorder' => false,
                'created_by' => $actorId,
                'updated_by' => $actorId,
                'created_at' => $createdAt->toDateTimeString(),
                'updated_at' => $createdAt->toDateTimeString(),
            ]);

            if ($categoryId !== null) {
                DB::table('product_categories')->insert([
                    'product_id' => $productId,
                    'category_id' => $categoryId,
                    'is_primary' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            if (isset($attributeIds['material'])) {
                DB::table('product_attribute_values')->insert([
                    'product_id' => $productId,
                    'attribute_id' => $attributeIds['material'],
                    'value' => $material,
                ]);
            }

            $isDefault = true;
            foreach ($sizes as $sizeIndex => $size) {
                $stock = $this->stockFor($index, $sizeIndex);
                $sku = sprintf(
                    'FKU-%s%02d-%s',
                    strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $leaf), 0, 4)),
                    $index + 1,
                    strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $size) ?: 'OS')
                );

                $variantId = DB::table('product_variants')->insertGetId([
                    'product_id' => $productId,
                    'sku' => $sku,
                    'name' => $size,
                    'price' => $priceFinal,
                    'price_original' => $priceOriginal,
                    'price_sale' => $priceFinal !== $price ? $priceFinal : null,
                    'stock' => $stock,
                    'po_stock' => 0,
                    'stock_reserved' => 0,
                    'stock_booked' => 0,
                    'stock_preorder' => 0,
                    'max_order_qty' => max(3, (int) floor($stock / 3)),
                    'min_stock' => 3,
                    'is_default' => $isDefault,
                    'created_at' => $createdAt->toDateTimeString(),
                    'updated_at' => $createdAt->toDateTimeString(),
                ]);
                $isDefault = false;
                $variantTotal++;

                if (isset($attributeIds['ukuran'])) {
                    DB::table('product_variant_values')->insert([
                        'variant_id' => $variantId,
                        'attribute_id' => $attributeIds['ukuran'],
                        'value' => $size,
                    ]);
                }

                DB::table('stock_movements')->insert([
                    'product_id' => $productId,
                    'variant_id' => $variantId,
                    'movement_key' => 'INIT-'.$variantId,
                    'type' => 'initial',
                    'quantity_delta' => $stock,
                    'balance_after' => $stock,
                    'notes' => 'Stok awal koleksi '.$name,
                    'occurred_at' => $createdAt->toDateTimeString(),
                    'created_by' => $actorId,
                    'created_at' => $createdAt->toDateTimeString(),
                    'updated_at' => $createdAt->toDateTimeString(),
                ]);
            }

            foreach ([['900x900', 1, 1], ['900x1200', 0, 2], ['900x1200', 0, 3]] as [$size, $isPrimary, $sort]) {
                DB::table('product_images')->insert([
                    'product_id' => $productId,
                    'url' => $this->imageUrl($leaf, $index + $sort, $size),
                    'alt_text' => $name.' — foto '.($sort),
                    'is_primary' => $isPrimary === 1,
                    'sort_order' => $sort,
                    'created_at' => $createdAt->toDateTimeString(),
                    'updated_at' => $createdAt->toDateTimeString(),
                ]);
            }
        }

        foreach (self::VOUCHERS as [$code, $voucherName, $target, $type, $value, $minSpend, $maxDiscount, $limit, $startOffset, $endOffset]) {
            DB::table('vouchers')->updateOrInsert(
                ['code' => $code],
                [
                    'name' => $voucherName,
                    'image' => $this->imageUrl('promo', $limit, '800x480'),
                    'discount_target' => $target,
                    'discount_type' => $type,
                    'discount_value' => $value,
                    'min_spend' => $minSpend,
                    'min_items' => 1,
                    'min_distinct_products' => 1,
                    'terms' => 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.',
                    'max_discount' => $maxDiscount,
                    'starts_at' => now()->addDays($startOffset)->toDateTimeString(),
                    'ends_at' => now()->addDays($endOffset)->toDateTimeString(),
                    'usage_limit' => $limit,
                    'used_count' => 0,
                    'is_active' => true,
                    'created_by' => $actorId,
                    'updated_by' => $actorId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $this->command?->info(sprintf(
            'Fashionku: %d produk, %d varian, %d voucher selesai.',
            count(self::PRODUCTS),
            $variantTotal,
            count(self::VOUCHERS)
        ));
    }

    private function imageUrl(string $leaf, int $offset, string $size): string
    {
        $pool = self::IMAGE_POOLS[$leaf] ?? ['1483985988355-763728e1935b'];
        $id = $pool[$offset % count($pool)];
        [$width, $height] = explode('x', $size);

        return sprintf('https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=%s&h=%s&q=80', $id, $width, $height);
    }

    private function stockFor(int $productIndex, int $variantIndex): int
    {
        $seed = ($productIndex + 1) * 37 + ($variantIndex + 1) * 11;

        return 6 + ($seed % 42);
    }
}