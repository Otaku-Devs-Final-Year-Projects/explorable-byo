import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // OR service_role key if available

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Ensure you temporarily disable RLS or use a Service Role Key to insert if RLS is strict.
// Assuming for MVP public inserts or the anon key can insert if policies allow it, if not, this might fail requiring a service key.
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Seeding Phase 2 Data...');

    // 1. Innovation Tools
    const tools = [
        {
            title: "Eco-Ramps v2",
            description: "Low-cost, durable ramps made from 100% recycled materials. Tested for optimal 1:12 gradients and severe weather resistance.",
            image_url: "https://images.unsplash.com/photo-1579407364450-481fe19bcbe8?auto=format&fit=crop&q=80",
            features: ["Recycled Materials", "Weather Resistant", "Easy Installation", "High Weight Capacity"]
        },
        {
            title: "Audio QR Signage Hub",
            description: "Generate audio-descriptive QR codes that can be placed on doors and menus to assist guests with visual impairments. Multi-language support.",
            image_url: "https://images.unsplash.com/photo-1596526131083-e8c638c9c6c7?auto=format&fit=crop&q=80",
            features: ["Audio Descriptions", "Multi-language", "Low Maintenance", "Free Generation"]
        },
        {
            title: "Sensory-Responsive Lighting Kits",
            description: "Adjustable warm lighting setups designed to reduce glare and accommodate guests with sensory sensitivities or autism. Smartphone controlled.",
            image_url: "https://images.unsplash.com/photo-1565814329452-e1efa11c5e8d?auto=format&fit=crop&q=80",
            features: ["Dimmable", "Warm Tones", "Anti-Glare", "Smart App Control"]
        }
    ];

    await supabase.from('innovation_tools').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // clear old
    const { error: error1 } = await supabase.from('innovation_tools').insert(tools);
    if (error1) console.error("Error seeding tools:", error1.message);
    else console.log("✅ Seeded Innovation Tools");

    // 2. Training Modules
    const modules = [
        {
            title: "Module 1: Foundations of Awareness",
            duration: "45 mins",
            description: "Understanding different types of disabilities (visible and hidden) and basic etiquette in hospitality.",
            image_url: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&q=80",
            order_index: 1
        },
        {
            title: "Module 2: Communicating with Care",
            duration: "60 mins",
            description: "Best practices for respectful and effective communication with diverse guests, including those with hearing or speech impairments.",
            image_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80",
            order_index: 2
        },
        {
            title: "Module 3: Assisting with Mobility",
            duration: "45 mins",
            description: "Practical scenarios: guiding a guest with severe visual impairment, using mobility equipment safely, and spatial awareness.",
            image_url: "https://images.unsplash.com/photo-1587370560942-1e5b121fb65a?auto=format&fit=crop&q=80",
            order_index: 3
        }
    ];

    await supabase.from('training_modules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: error2 } = await supabase.from('training_modules').insert(modules);
    if (error2) console.error("Error seeding modules:", error2.message);
    else console.log("✅ Seeded Training Modules");

    // 3. Community Posts
    const posts = [
        {
            author_name: "Sarah Jenkins",
            author_avatar: "SJ",
            title: "Best wheelchair accessible dining with power outlets?",
            content: "Hi everyone, I use a power chair and need places where I can easily maneuver and optionally plug in if needed during long work lunches in the CBD.",
            likes: 32,
            tag: "Dining"
        },
        {
            author_name: "David M.",
            author_avatar: "DM",
            title: "Review: The Nesbitt Castle accessibility updates",
            content: "Just wanted to share that they recently added a new portable ramp for the lower gardens. The staff was incredibly trained and asked before assisting. 5/5 experience.",
            likes: 45,
            tag: "Review"
        },
        {
            author_name: "Elena R.",
            author_avatar: "ER",
            title: "Sensory-friendly hours at local museums?",
            content: "Does anyone know if the Natural History Museum still does the low-light/low-noise hours on Tuesday mornings? It's been a while since I visited.",
            likes: 12,
            tag: "Question"
        }
    ];

    await supabase.from('community_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: error3 } = await supabase.from('community_posts').insert(posts);
    if (error3) console.error("Error seeding posts:", error3.message);
    else console.log("✅ Seeded Community Posts");

    // 4. News Articles
    const articles = [
        {
            title: "ExplorAble Partners with Zimbabwe Tourism Authority",
            excerpt: "A landmark agreement to integrate our verified accessibility data directly into the national tourism planning dashboard.",
            category: "Partnership",
            image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80",
            is_featured: true,
            content: "Full content here..."
        },
        {
            title: "New Feature: AI-Powered Audio Navigation",
            excerpt: "Our web app now supports full voice navigation for visually impaired users. Learn how to use 'Peace of Mind' mode.",
            category: "Platform Update",
            image_url: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?auto=format&fit=crop&q=80",
            is_featured: false,
            content: "Full content here..."
        },
        {
            title: "Call for Volunteers: Bulawayo Mapping Drive",
            excerpt: "We are looking for local volunteers to help us verify 50 new venues in the CBD this coming weekend. Will provide training.",
            category: "Community",
            image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
            is_featured: false,
            content: "Full content here..."
        }
    ];

    await supabase.from('news_articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: error4 } = await supabase.from('news_articles').insert(articles);
    if (error4) console.error("Error seeding news:", error4.message);
    else console.log("✅ Seeded News Articles");

    console.log('🎉 Seeding Complete!');
}

seed();
