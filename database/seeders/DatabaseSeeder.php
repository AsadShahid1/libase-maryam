<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Banner;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions Setup (Laravel Spatie setup)
        // Ensure no foreign key violations
        DB::statement('PRAGMA foreign_keys = OFF;');
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('model_has_permissions')->truncate();
        DB::table('users')->truncate();
        DB::table('brands')->truncate();
        DB::table('categories')->truncate();
        DB::table('products')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('banners')->truncate();
        DB::table('settings')->truncate();
        DB::statement('PRAGMA foreign_keys = ON;');

        // Create initial permissions
        $permissions = [
            'manage-users',
            'manage-roles',
            'manage-permissions',
            'view-admin-dashboard',
            'view-user-dashboard',
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->insert([
                'name' => $permission,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create Admin role & assign all permissions
        $adminRoleId = DB::table('roles')->insertGetId([
            'name' => 'admin',
            'guard_name' => 'web',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $allPermIds = DB::table('permissions')->pluck('id');
        foreach ($allPermIds as $permId) {
            DB::table('role_has_permissions')->insert([
                'permission_id' => $permId,
                'role_id' => $adminRoleId
            ]);
        }

        // Create User role
        $userRoleId = DB::table('roles')->insertGetId([
            'name' => 'user',
            'guard_name' => 'web',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $userPermId = DB::table('permissions')->where('name', 'view-user-dashboard')->first()->id;
        DB::table('role_has_permissions')->insert([
            'permission_id' => $userPermId,
            'role_id' => $userRoleId
        ]);

        // Create Admin & Staff Users
        $adminUser = User::create([
            'name'     => 'Super Admin',
            'email'    => 'admin@libasemaryam.com',
            'password' => Hash::make('password'),
        ]);
        $adminUser->assignRole('admin');

        $staffUser = User::create([
            'name'     => 'Boutique Staff',
            'email'    => 'staff@libasemaryam.com',
            'password' => Hash::make('password'),
        ]);
        $staffUser->assignRole('user');

        // 2. Settings Seeding (Company Details & Payment Toggles)
        $settings = [
            'company_name' => 'Libas-E-Maryam',
            'company_tagline' => 'A Tradition of Elegance',
            'company_logo' => '/logo.jpg',
            'company_phone' => '0321-4676591',
            'company_email' => 'info@libasemaryam.com',
            'company_address' => 'DHA Phase 5, Lahore.',
            'social_facebook' => 'https://www.facebook.com/people/Libas-Maryam/61572106610070/',
            'social_instagram' => 'https://www.instagram.com/libasemaryam',
            'social_whatsapp' => 'https://wa.me/923214676591',
            'about_us_title' => 'The Story of Libas-E-Maryam',
            'about_us_content' => 'Libas-E-Maryam brings you a heritage of traditional artistry. Specialized in high-end tailored lehengas, hand-worked velvet shawls, and premium embroidered cotton lawn, our mission is to create royal Eastern ensembles that reflect luxury and comfort.',
            'about_us_image' => '/assets/product_silk.jpg',
            
            // Payment Gateway Configurations (Boolean Toggle flags)
            'payment_cod_enabled' => '1',
            'payment_bank_enabled' => '1',
            'payment_easypaisa_enabled' => '1',
            'payment_jazzcash_enabled' => '1',
            
            'payment_bank_details' => 'Habib Bank Limited (HBL) - A/C: 12345678901234 - Branch Code: 0101',
            'payment_easypaisa_details' => 'EasyPaisa Merchant - Phone: 0300-1234567 - Name: Libas-E-Maryam',
            'payment_jazzcash_details' => 'JazzCash Merchant - Till ID: 987654 - Phone: 0300-1234567'
        ];

        foreach ($settings as $key => $val) {
            Setting::setValue($key, $val);
        }

        // 3. 10 Brands Seeding
        $brandsData = [
            ['name' => 'Libas-E-Maryam Signature', 'slug' => 'signature', 'description' => 'Our ultra-luxury custom embroidered line.'],
            ['name' => 'Maryam Pret', 'slug' => 'pret', 'description' => 'Ready-to-wear casual and semi-formal collections.'],
            ['name' => 'Heritage Weaves', 'slug' => 'heritage', 'description' => 'Traditional handloom and handwoven designs.'],
            ['name' => 'Zari Luxury', 'slug' => 'zari-luxury', 'description' => 'Finest gold and silver tilla hand embroidery.'],
            ['name' => 'Resham Weaves', 'slug' => 'resham-weaves', 'description' => 'Delicate silk thread embroidery and fabrics.'],
            ['name' => 'Velvet Royalty', 'slug' => 'velvet-royalty', 'description' => 'Plush, royal winter velvet shawls and suits.'],
            ['name' => 'Lawn Luxe', 'slug' => 'lawn-luxe', 'description' => 'Premium cotton lawn collection with designer lace.'],
            ['name' => 'Peshwas Classics', 'slug' => 'peshwas-classics', 'description' => 'Traditional long flowing silhouettes and kalidaars.'],
            ['name' => 'Gharara Glamour', 'slug' => 'gharara-glamour', 'description' => 'Royal court style ghararas and sharara sets.'],
            ['name' => 'Silk Splendor', 'slug' => 'silk-splendor', 'description' => 'Pure raw silk and jamawar festive ensembles.']
        ];
        $brands = [];
        foreach ($brandsData as $b) {
            $brands[$b['slug']] = Brand::create($b);
        }

        // 4. 10 Categories Seeding
        $categoriesData = [
            ['name' => 'Luxury Silk', 'slug' => 'luxury-silk', 'description' => 'Exquisite raw silks and jamawar suits.', 'image' => '/assets/product_silk.jpg'],
            ['name' => 'Premium Lawn', 'slug' => 'premium-lawn', 'description' => 'Designer embroidered cotton lawn suits.', 'image' => '/assets/product_lawn.jpg'],
            ['name' => 'Velvet Festive', 'slug' => 'velvet-festive', 'description' => 'Royal plush velvet shawls and ghararas.', 'image' => '/assets/product_velvet.jpg'],
            ['name' => 'Chiffon Collection', 'slug' => 'chiffon', 'description' => 'Delicate hand-worked formal chiffons.', 'image' => '/assets/product_silk.jpg'],
            ['name' => 'Organza Formals', 'slug' => 'organza-formals', 'description' => 'Sheer organza heavily embellished peshwas.', 'image' => '/assets/product_silk.jpg'],
            ['name' => 'Cotton Casuals', 'slug' => 'cotton-casuals', 'description' => 'Breathable casual wear and daily kurtas.', 'image' => '/assets/product_lawn.jpg'],
            ['name' => 'Jamawar Classics', 'slug' => 'jamawar-classics', 'description' => 'Intricate handwoven jamawar fabrics.', 'image' => '/assets/product_silk.jpg'],
            ['name' => 'Net Embroidered', 'slug' => 'net-embroidered', 'description' => 'Delicate net fabrics with pastel work.', 'image' => '/assets/product_lawn.jpg'],
            ['name' => 'Georgette Drapes', 'slug' => 'georgette-drapes', 'description' => 'Flowy georgette anarkalis and suits.', 'image' => '/assets/product_velvet.jpg'],
            ['name' => 'Bridal Couture', 'slug' => 'bridal-couture', 'description' => 'Exquisite bridal wear made to order.', 'image' => '/assets/product_velvet.jpg']
        ];
        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::create($c);
        }

        // 5. 10 Banners Seeding
        $banners = [
            ['title' => 'Royal Velvet Collections', 'subtitle' => 'Embellished deep maroon and emerald colors', 'image' => '/assets/product_velvet.jpg', 'link' => '/products?category=velvet-festive', 'position' => 'homepage'],
            ['title' => 'Sophisticated Raw Silk', 'subtitle' => 'Gilded embroidery and intricate needlework', 'image' => '/assets/product_silk.jpg', 'link' => '/products?category=luxury-silk', 'position' => 'homepage'],
            ['title' => 'Summer Lawn Prints', 'subtitle' => 'Comfort meets designer lace detailing', 'image' => '/assets/product_lawn.jpg', 'link' => '/products?category=premium-lawn', 'position' => 'homepage'],
            ['title' => 'Luxury Chiffon Drapes', 'subtitle' => 'Floating silhouettes for wedding guests', 'image' => '/assets/product_silk.jpg', 'link' => '/products?category=chiffon', 'position' => 'homepage'],
            ['title' => 'Exquisite Bridal Couture', 'subtitle' => 'Plush handcrafted custom bridal attire', 'image' => '/assets/product_velvet.jpg', 'link' => '/products?category=bridal-couture', 'position' => 'homepage'],
            ['title' => 'Festivities Organza Collection', 'subtitle' => 'Sheer luxury embroidery and details', 'image' => '/assets/product_silk.jpg', 'link' => '/products?category=organza-formals', 'position' => 'homepage'],
            ['title' => 'Premium Pret Wear', 'subtitle' => 'Ready-to-wear daily boutique prints', 'image' => '/assets/product_lawn.jpg', 'link' => '/products?category=cotton-casuals', 'position' => 'homepage'],
            ['title' => 'Heritage Handloom Weaves', 'subtitle' => 'Traditional court styles and patterns', 'image' => '/assets/product_silk.jpg', 'link' => '/products?category=jamawar-classics', 'position' => 'homepage'],
            ['title' => 'Cozy Winter Gharara', 'subtitle' => 'Heavy embellished traditional shararas', 'image' => '/assets/product_velvet.jpg', 'link' => '/products?category=georgette-drapes', 'position' => 'homepage'],
            ['title' => 'Elegant Evening Net Wear', 'subtitle' => 'Delicate lace borders and prints', 'image' => '/assets/product_lawn.jpg', 'link' => '/products?category=net-embroidered', 'position' => 'homepage']
        ];
        foreach ($banners as $ban) {
            Banner::create($ban);
        }

        // 6. 10 Products Seeding with Variants and Stocks
        // Product 1
        $p1 = Product::create([
            'category_id' => $categories['luxury-silk']->id,
            'brand_id' => $brands['signature']->id,
            'name' => 'Shehnai Gold-Embroidered Raw Silk Lehenga',
            'slug' => 'shehnai-gold-embroidered-raw-silk-lehenga',
            'description' => 'Heavily embellished traditional silk attire with intricate metallic thread tilla embroidery and champagne cream drapes. Features hand-placed pearls and zari borders.',
            'price' => 34500.00,
            'sale_price' => 31000.00,
            'is_on_sale' => true,
            'stock' => 15,
            'image' => '/assets/product_silk.jpg'
        ]);
        ProductVariant::create(['product_id' => $p1->id, 'size' => 'S', 'color' => 'Champagne Gold', 'stock' => 5, 'sku' => 'SHN-GLD-S']);
        ProductVariant::create(['product_id' => $p1->id, 'size' => 'M', 'color' => 'Champagne Gold', 'stock' => 5, 'sku' => 'SHN-GLD-M']);
        ProductVariant::create(['product_id' => $p1->id, 'size' => 'L', 'color' => 'Champagne Gold', 'stock' => 5, 'sku' => 'SHN-GLD-L']);

        // Product 2
        $p2 = Product::create([
            'category_id' => $categories['premium-lawn']->id,
            'brand_id' => $brands['pret']->id,
            'name' => 'Gul-o-Bahar Embroidered Mint Lawn Suit',
            'slug' => 'gul-o-bahar-embroidered-mint-lawn-suit',
            'description' => 'Delicate floral premium summer cotton lawn ensemble decorated with detailed lace motifs and soft pastel mint tones. Paired with a printed silk dupatta.',
            'price' => 14500.00,
            'stock' => 30,
            'image' => '/assets/product_lawn.jpg'
        ]);
        ProductVariant::create(['product_id' => $p2->id, 'size' => 'S', 'color' => 'Mint Green', 'stock' => 10, 'sku' => 'GOB-MNT-S']);
        ProductVariant::create(['product_id' => $p2->id, 'size' => 'M', 'color' => 'Mint Green', 'stock' => 10, 'sku' => 'GOB-MNT-M']);
        ProductVariant::create(['product_id' => $p2->id, 'size' => 'L', 'color' => 'Mint Green', 'stock' => 10, 'sku' => 'GOB-MNT-L']);

        // Product 3
        $p3 = Product::create([
            'category_id' => $categories['velvet-festive']->id,
            'brand_id' => $brands['heritage']->id,
            'name' => 'Zari Royal Velvet Gharara Suit',
            'slug' => 'zari-royal-velvet-gharara-suit',
            'description' => 'Winter luxury velvet in a deep royal maroon, detailed with elaborate traditional tilla work and hand-crafted border accents. Comes with a matching embellished dupatta.',
            'price' => 42000.00,
            'sale_price' => 39500.00,
            'is_on_sale' => true,
            'stock' => 12,
            'image' => '/assets/product_velvet.jpg'
        ]);
        ProductVariant::create(['product_id' => $p3->id, 'size' => 'S', 'color' => 'Maroon Red', 'stock' => 4, 'sku' => 'ZAR-MRN-S']);
        ProductVariant::create(['product_id' => $p3->id, 'size' => 'M', 'color' => 'Maroon Red', 'stock' => 4, 'sku' => 'ZAR-MRN-M']);
        ProductVariant::create(['product_id' => $p3->id, 'size' => 'L', 'color' => 'Maroon Red', 'stock' => 4, 'sku' => 'ZAR-MRN-L']);

        // Product 4
        $p4 = Product::create([
            'category_id' => $categories['chiffon']->id,
            'brand_id' => $brands['zari-luxury']->id,
            'name' => 'Afreen Embroidered Chiffon Kalidaar',
            'slug' => 'afreen-embroidered-chiffon-kalidaar',
            'description' => 'A floating silhouette of ivory crinkle chiffon detailed with gold mirror embellishments and silk thread work. The ultimate wedding guest dress.',
            'price' => 28000.00,
            'stock' => 8,
            'image' => '/assets/product_silk.jpg'
        ]);
        ProductVariant::create(['product_id' => $p4->id, 'size' => 'S', 'color' => 'Ivory White', 'stock' => 3, 'sku' => 'AFR-IVR-S']);
        ProductVariant::create(['product_id' => $p4->id, 'size' => 'M', 'color' => 'Ivory White', 'stock' => 3, 'sku' => 'AFR-IVR-M']);
        ProductVariant::create(['product_id' => $p4->id, 'size' => 'L', 'color' => 'Ivory White', 'stock' => 2, 'sku' => 'AFR-IVR-L']);

        // Product 5
        $p5 = Product::create([
            'category_id' => $categories['organza-formals']->id,
            'brand_id' => $brands['resham-weaves']->id,
            'name' => 'Noor-ul-Ain Handworked Organza Peshwas',
            'slug' => 'noor-ul-ain-handworked-organza-peshwas',
            'description' => 'Intricately handcrafted sheer organza peshwas styled in royal silver beadwork. Features a floor-length circular flair silhouette.',
            'price' => 36000.00,
            'stock' => 10,
            'image' => '/assets/product_silk.jpg'
        ]);
        ProductVariant::create(['product_id' => $p5->id, 'size' => 'S', 'color' => 'Mint Green', 'stock' => 3, 'sku' => 'NUA-ORG-S']);
        ProductVariant::create(['product_id' => $p5->id, 'size' => 'M', 'color' => 'Mint Green', 'stock' => 4, 'sku' => 'NUA-ORG-M']);
        ProductVariant::create(['product_id' => $p5->id, 'size' => 'L', 'color' => 'Mint Green', 'stock' => 3, 'sku' => 'NUA-ORG-L']);

        // Product 6
        $p6 = Product::create([
            'category_id' => $categories['cotton-casuals']->id,
            'brand_id' => $brands['lawn-luxe']->id,
            'name' => 'Jasmine Embroidered Cotton Casual Kurta',
            'slug' => 'jasmine-embroidered-cotton-casual-kurta',
            'description' => 'Light, breathable daily cotton tunic decorated with white cotton lace details and minimal jasmine embroidery. Ideal for summer workdays.',
            'price' => 8500.00,
            'stock' => 25,
            'image' => '/assets/product_lawn.jpg'
        ]);
        ProductVariant::create(['product_id' => $p6->id, 'size' => 'S', 'color' => 'Ivory White', 'stock' => 10, 'sku' => 'JAS-COT-S']);
        ProductVariant::create(['product_id' => $p6->id, 'size' => 'M', 'color' => 'Ivory White', 'stock' => 10, 'sku' => 'JAS-COT-M']);
        ProductVariant::create(['product_id' => $p6->id, 'size' => 'L', 'color' => 'Ivory White', 'stock' => 5, 'sku' => 'JAS-COT-L']);

        // Product 7
        $p7 = Product::create([
            'category_id' => $categories['jamawar-classics']->id,
            'brand_id' => $brands['silk-splendor']->id,
            'name' => 'Shahi Jamawar Bridal Lehenga & Sherwani',
            'slug' => 'shahi-jamawar-bridal-lehenga-sherwani',
            'description' => 'Royal courts gold jamawar lehenga set woven with intricate traditional gold brocade works and hand-sewn beads.',
            'price' => 85000.00,
            'sale_price' => 78000.00,
            'is_on_sale' => true,
            'stock' => 6,
            'image' => '/assets/product_silk.jpg'
        ]);
        ProductVariant::create(['product_id' => $p7->id, 'size' => 'M', 'color' => 'Champagne Gold', 'stock' => 3, 'sku' => 'SHH-JAM-M']);
        ProductVariant::create(['product_id' => $p7->id, 'size' => 'L', 'color' => 'Champagne Gold', 'stock' => 3, 'sku' => 'SHH-JAM-L']);

        // Product 8
        $p8 = Product::create([
            'category_id' => $categories['net-embroidered']->id,
            'brand_id' => $brands['gharara-glamour']->id,
            'name' => 'Mehr-un-Nisa Heavily Embroidered Net Gown',
            'slug' => 'mehr-un-nisa-heavily-embroidered-net-gown',
            'description' => 'Delicate net gown lined with pure raw silk and embellished with sequined panels and threadwork borders.',
            'price' => 45000.00,
            'stock' => 10,
            'image' => '/assets/product_lawn.jpg'
        ]);
        ProductVariant::create(['product_id' => $p8->id, 'size' => 'S', 'color' => 'Maroon Red', 'stock' => 3, 'sku' => 'MUN-NET-S']);
        ProductVariant::create(['product_id' => $p8->id, 'size' => 'M', 'color' => 'Maroon Red', 'stock' => 4, 'sku' => 'MUN-NET-M']);
        ProductVariant::create(['product_id' => $p8->id, 'size' => 'L', 'color' => 'Maroon Red', 'stock' => 3, 'sku' => 'MUN-NET-L']);

        // Product 9
        $p9 = Product::create([
            'category_id' => $categories['georgette-drapes']->id,
            'brand_id' => $brands['peshwas-classics']->id,
            'name' => 'Dilara Mirror-Work Georgette Anarkali',
            'slug' => 'dilara-mirror-work-georgette-anarkali',
            'description' => 'Traditional mirror-work bodice set on fluid crepe georgette flair skirt, paired with a matching mirror dupatta.',
            'price' => 19500.00,
            'stock' => 14,
            'image' => '/assets/product_velvet.jpg'
        ]);
        ProductVariant::create(['product_id' => $p9->id, 'size' => 'S', 'color' => 'Mint Green', 'stock' => 5, 'sku' => 'DIL-GEO-S']);
        ProductVariant::create(['product_id' => $p9->id, 'size' => 'M', 'color' => 'Mint Green', 'stock' => 5, 'sku' => 'DIL-GEO-M']);
        ProductVariant::create(['product_id' => $p9->id, 'size' => 'L', 'color' => 'Mint Green', 'stock' => 4, 'sku' => 'DIL-GEO-L']);

        // Product 10
        $p10 = Product::create([
            'category_id' => $categories['bridal-couture']->id,
            'brand_id' => $brands['velvet-royalty']->id,
            'name' => 'Shehzadi Handcrafted Velvet Bridal Gown',
            'slug' => 'shehzadi-handcrafted-velvet-bridal-gown',
            'description' => 'Our flagship royal bridal velvet gown detailed with heavy zardozi handworks. Tailored to custom measures upon order.',
            'price' => 95000.00,
            'stock' => 5,
            'image' => '/assets/product_velvet.jpg'
        ]);
        ProductVariant::create(['product_id' => $p10->id, 'size' => 'S', 'color' => 'Maroon Red', 'stock' => 2, 'sku' => 'SHZ-VEL-S']);
        ProductVariant::create(['product_id' => $p10->id, 'size' => 'M', 'color' => 'Maroon Red', 'stock' => 2, 'sku' => 'SHZ-VEL-M']);
        ProductVariant::create(['product_id' => $p10->id, 'size' => 'L', 'color' => 'Maroon Red', 'stock' => 1, 'sku' => 'SHZ-VEL-L']);
    }
}
