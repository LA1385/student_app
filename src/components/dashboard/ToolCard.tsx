"use client"

import Icon from "@/components/shared/Icon"

export default function ToolCard({ name, icon, href }: { name: string, icon: string, href: string }) {
    
    const Tools = [
        { icon: 'calculator', name: 'Calculator', href: '/tools/calculator' },
        { icon: 'converter', name: 'Converter', href: '/tools/converter' },
        { icon: 'file-Compression', name: 'File Compression', href: '/tools/file-compression' },
        { icon: 'Zip', name: 'Zip', href: '/tools/zip' },
    ]

    return (
        <div>
            {Tools.map((tool, index) => (
                <a 
                    key={index}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Icon name={tool.icon} />
                    <h3>{tool.name}</h3>
                </a>
            ))}
        </div>
    )
}
