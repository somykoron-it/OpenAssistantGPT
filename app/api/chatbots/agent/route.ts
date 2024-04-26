import { exec } from 'child_process';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log(req);
//   if (req.method === 'POST') {
//     console.log(req);
//     const { cmd } = req.body;

//     // Check if cmd is provided
//     if (!cmd) {
//       return res.status(400).json({ error: 'Command is required.' });
//     }

//     // Execute the command
//     exec(cmd, (err, stdout, stderr) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(200).json({ output: stdout });
//     });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     console.log('Check');
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

export async function POST(req: Request) {
  const { cmd } = await req.json();

  // Check if cmd is provided
  if (!cmd) {
    return new Response('Command is required.', { status: 400 });
  }

  try {
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });

    if (stderr) {
      console.error(stderr);
      return new Response(stderr, { status: 500 });
    }

    return new Response(JSON.stringify({ output: stdout }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
