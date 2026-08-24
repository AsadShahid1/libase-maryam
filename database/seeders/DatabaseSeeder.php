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
        // 1. Roles & Permissions Setup
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

        $adminUser = User::create([
            'name'     => 'Super Admin',
            'email'    => 'admin@libasemaryam.com',
            'password' => Hash::make('password'),
        ]);
        $adminUser->assignRole('admin');

        $staffUser = User::create([
            'name'     => 'Boutique Customer',
            'email'    => 'user@libasemaryam.com',
            'password' => Hash::make('password'),
        ]);
        $staffUser->assignRole('user');

        // 2. Settings (PKR Currency & Company Details)
        $settings = [
            'company_name'       => 'Libas-E-Maryam Signature',
            'company_tagline'    => 'A Tradition of Elegance & Luxury Boutique Attire',
            'company_logo'       => '/assets/logo.jpg',
            'company_phone'      => '0321-4676591',
            'company_email'      => 'info@libasemaryam.com',
            'company_address'    => 'DHA Phase 5, Lahore, Pakistan',
            'currency_symbol'    => 'PKR',
            'currency_code'      => 'PKR',
            'about_us_title'     => 'The Story of Libas-E-Maryam',
            'about_us_content'   => 'Traditional Eastern attire crafted with luxury textiles and delicate hand-embellished zari thread works. We specialize in bespoke tailored lehengas, velvet festive collections, and luxury silks.',
            'about_us_image'     => '/assets/product_silk.jpg',
            'payment_cod_enabled' => '1',
            'payment_bank_enabled' => '1',
            'payment_easypaisa_enabled' => '1',
            'payment_jazzcash_enabled' => '1',
        ];

        foreach ($settings as $key => $val) {
            Setting::create(['key' => $key, 'value' => $val]);
        }

        // 3. Brands
        $brandsData = [
            ['name' => 'Maryam Signature', 'slug' => 'maryam-signature', 'description' => 'Bespoke hand-worked silk and velvet couture ensembles.'],
            ['name' => 'Velvet Royalty', 'slug' => 'velvet-royalty', 'description' => 'Plush royal velvet shawls and festive suits.'],
            ['name' => 'Lawn Luxe', 'slug' => 'lawn-luxe', 'description' => 'Designer embroidered cotton lawn collections.'],
            ['name' => 'Silk Splendor', 'slug' => 'silk-splendor', 'description' => 'Pure raw silk and jamawar festive attire.'],
            ['name' => 'Heritage Weaves', 'slug' => 'heritage-weaves', 'description' => 'Traditional handloom and artisan threadwork.'],
        ];

        $brandModels = [];
        foreach ($brandsData as $b) {
            $brandModels[$b['slug']] = Brand::create($b);
        }

        // 4. Categories (100% Boutique Dress Images)
        $categoriesData = [
            ['name' => 'Velvet Festive', 'slug' => 'velvet-festive', 'description' => 'Royal plush velvet shawls, ghararas, and heavily embellished suits.', 'image' => '/assets/product_velvet.jpg'],
            ['name' => 'Luxury Silk', 'slug' => 'luxury-silk', 'description' => 'Exquisite raw silk, anarkali, and jamawar ensembles.', 'image' => '/assets/product_silk.jpg'],
            ['name' => 'Premium Lawn', 'slug' => 'premium-lawn', 'description' => 'Designer embroidered 3-piece cotton lawn suits.', 'image' => '/assets/product_lawn.jpg'],
            ['name' => 'Chiffon & Organza', 'slug' => 'chiffon-organza', 'description' => 'Delicate hand-worked formal chiffons and organza peshwas.', 'image' => '/assets/libasemaryam1.png'],
            ['name' => 'Bridal Couture', 'slug' => 'bridal-couture', 'description' => 'Exquisite bespoke bridal wear and handcrafted lehengas.', 'image' => '/assets/libasemaryam2.png'],
            ['name' => 'Pret Wear', 'slug' => 'pret-wear', 'description' => 'Ready-to-wear casual and semi-formal boutique prints.', 'image' => '/assets/libasemmaryam.png'],
        ];

        $categoryModels = [];
        foreach ($categoriesData as $c) {
            $categoryModels[$c['slug']] = Category::create($c);
        }

        // 5. Products (PKR Prices & Boutique Dress Images)
        $products = [
            [
                'name'         => 'Royal Velvet Gilded Festive Suit',
                'slug'         => 'royal-velvet-gilded-festive-suit',
                'description'  => 'Heavy micro-velvet shirt embellished with hand-worked tilla zari embroidery along the neckline and sleeves, paired with jamawar trousers and a heavy embroidered velvet shawl.',
                'price'        => 28500.00,
                'sale_price'   => 24500.00,
                'is_on_sale'   => true,
                'is_featured'  => true,
                'stock'        => 15,
                'sku'          => 'SUIT-VELVET-01',
                'image'        => '/assets/product_velvet.jpg',
                'category_id'  => $categoryModels['velvet-festive']->id,
                'brand_id'     => $brandModels['velvet-royalty']->id,
                'variants'     => [
                    ['size' => 'S', 'color' => 'Deep Maroon', 'stock' => 5],
                    ['size' => 'M', 'color' => 'Deep Maroon', 'stock' => 6],
                    ['size' => 'L', 'color' => 'Deep Maroon', 'stock' => 4],
                ]
            ],
            [
                'name'         => 'Pure Raw Silk Embroidered Anarkali',
                'slug'         => 'pure-raw-silk-embroidered-anarkali',
                'description'  => 'Bespoke hand-worked raw silk anarkali flared dress featuring gilded zardozi threadwork along the border, paired with an organza dupatta.',
                'price'        => 38000.00,
                'sale_price'   => 32000.00,
                'is_on_sale'   => true,
                'is_featured'  => true,
                'stock'        => 12,
                'sku'          => 'SUIT-SILK-02',
                'image'        => '/assets/product_silk.jpg',
                'category_id'  => $categoryModels['luxury-silk']->id,
                'brand_id'     => $brandModels['silk-splendor']->id,
                'variants'     => [
                    ['size' => 'S', 'color' => 'Champagne Gold', 'stock' => 4],
                    ['size' => 'M', 'color' => 'Champagne Gold', 'stock' => 5],
                    ['size' => 'L', 'color' => 'Champagne Gold', 'stock' => 3],
                ]
            ],
            [
                'name'         => 'Designer Embroidered 3-Piece Lawn',
                'slug'         => 'designer-embroidered-3-piece-lawn',
                'description'  => '3-piece luxury printed cotton lawn suit with organza embroidered front lace borders and a sheer printed chiffon dupatta.',
                'price'        => 14500.00,
                'sale_price'   => 11500.00,
                'is_on_sale'   => true,
                'is_featured'  => true,
                'stock'        => 30,
                'sku'          => 'SUIT-LAWN-03',
                'image'        => '/assets/product_lawn.jpg',
                'category_id'  => $categoryModels['premium-lawn']->id,
                'brand_id'     => $brandModels['lawn-luxe']->id,
                'variants'     => [
                    ['size' => 'Unstitched', 'color' => 'Pastel Mint', 'stock' => 15],
                    ['size' => 'M', 'color' => 'Pastel Mint', 'stock' => 15],
                ]
            ],
            [
                'name'         => 'Hand-Worked Organza Peshwas Ensemble',
                'slug'         => 'hand-worked-organza-peshwas-ensemble',
                'description'  => 'Sheer organza long peshwas featuring delicate thread floral motifs, paired with a silk inner undershirt and embroidered dupatta.',
                'price'        => 35000.00,
                'sale_price'   => 29500.00,
                'is_on_sale'   => true,
                'is_featured'  => true,
                'stock'        => 10,
                'sku'          => 'SUIT-PESHWAS-04',
                'image'        => '/assets/libasemaryam1.png',
                'category_id'  => $categoryModels['chiffon-organza']->id,
                'brand_id'     => $brandModels['maryam-signature']->id,
                'variants'     => [
                    ['size' => 'S', 'color' => 'Ivory White', 'stock' => 3],
                    ['size' => 'M', 'color' => 'Ivory White', 'stock' => 4],
                    ['size' => 'L', 'color' => 'Ivory White', 'stock' => 3],
                ]
            ],
            [
                'name'         => 'Exquisite Bridal Handcraft Lehenga',
                'slug'         => 'exquisite-bridal-handcraft-lehenga',
                'description'  => 'Heavy custom bridal lehenga choli embellished with dabka, naqshi, resham, and crystal stones. Includes heavy velvet dupatta.',
                'price'        => 85000.00,
                'sale_price'   => 75000.00,
                'is_on_sale'   => true,
                'is_featured'  => true,
                'stock'        => 5,
                'sku'          => 'BRIDAL-LEHENGA-05',
                'image'        => '/assets/libasemaryam2.png',
                'category_id'  => $categoryModels['bridal-couture']->id,
                'brand_id'     => $brandModels['maryam-signature']->id,
                'variants'     => [
                    ['size' => 'Custom Sized', 'color' => 'Royal Crimson', 'stock' => 5],
                ]
            ],
            [
                'name'         => 'Luxury Pret Embroidered Kurta Set',
                'slug'         => 'luxury-pret-embroidered-kurta-set',
                'description'  => 'Ready-to-wear daily boutique printed kurta set with delicate lace trims and cotton pants.',
                'price'        => 9500.00,
                'sale_price'   => 7500.00,
                'is_on_sale'   => true,
                'is_featured'  => false,
                'stock'        => 25,
                'sku'          => 'PRET-KURTA-06',
                'image'        => '/assets/libasemmaryam.png',
                'category_id'  => $categoryModels['pret-wear']->id,
                'brand_id'     => $brandModels['lawn-luxe']->id,
                'variants'     => [
                    ['size' => 'S', 'color' => 'Sky Blue', 'stock' => 8],
                    ['size' => 'M', 'color' => 'Sky Blue', 'stock' => 10],
                    ['size' => 'L', 'color' => 'Sky Blue', 'stock' => 7],
                ]
            ]
        ];

        foreach ($products as $pData) {
            $variants = $pData['variants'];
            unset($pData['variants']);

            $product = Product::create($pData);

            foreach ($variants as $v) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size'       => $v['size'],
                    'color'      => $v['color'],
                    'stock'      => $v['stock'],
                    'sku'        => $product->sku . '-' . strtoupper(substr($v['color'], 0, 3)) . '-' . $v['size'],
                ]);
            }
        }

        // 6. Banners (100% Boutique Dress Images)
        $banners = [
            [
                'title'       => 'Royal Velvet & Raw Silk Collections',
                'subtitle'    => 'Embellished deep maroon, gold zari, and emerald boutique ensembles.',
                'image'       => '/assets/product_velvet.jpg',
                'link'        => '/products?category=velvet-festive',
                'position'    => 'homepage',
            ],
            [
                'title'       => 'Exquisite Hand-Worked Couture',
                'subtitle'    => 'Bespoke silk anarkalis and organza peshwas for festive occasions.',
                'image'       => '/assets/product_silk.jpg',
                'link'        => '/products?category=luxury-silk',
                'position'    => 'homepage',
            ],
            [
                'title'       => 'Summer Lawn & Pret Prints',
                'subtitle'    => 'Comfort meets designer lace detailing and breathable cottons.',
                'image'       => '/assets/product_lawn.jpg',
                'link'        => '/products?category=premium-lawn',
                'position'    => 'homepage',
            ],
        ];

        foreach ($banners as $b) {
            Banner::create($b);
        }
    }
}
