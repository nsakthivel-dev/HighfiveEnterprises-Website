import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TeamMemberNode extends d3.SimulationNodeDatum {
  id?: string;
  name: string;
  role: string;
  department?: string;
  image: string;
}

type TeamNetworkProps = {
  members: TeamMemberNode[];
  activeNode: string | null;
  onNodeClick: (id: string | null) => void;
};

export function TeamNetwork({ members, activeNode, onNodeClick }: TeamNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    setDimensions({ width, height });

    const simulation = d3.forceSimulation<TeamMemberNode>(members)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80));

    const svg = d3.select(svgRef.current);
    
    const drag = d3.drag<SVGGElement, TeamMemberNode>()
      .on('start', (event: d3.D3DragEvent<SVGGElement, TeamMemberNode, TeamMemberNode>, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: d3.D3DragEvent<SVGGElement, TeamMemberNode, TeamMemberNode>, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: d3.D3DragEvent<SVGGElement, TeamMemberNode, TeamMemberNode>, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodes = svg.selectAll<SVGGElement, TeamMemberNode>('g.node')
      .data(members)
      .join('g')
      .attr('class', 'node')
      .call(drag);

    const images = nodes.append('image')
      .attr('xlink:href', (d: TeamMemberNode) => d.image || '')
      .attr('x', -35)
      .attr('y', -35)
      .attr('width', 70)
      .attr('height', 70)
      .attr('clip-path', 'circle(35px)');

    const circles = nodes.append('circle')
      .attr('r', 40)
      .attr('fill', d => getDepartmentColor(d.department));

    simulation.on('tick', () => {
      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [members, dimensions]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full bg-[#0a0e27]"
      style={{ cursor: 'grab' }}
    />
  );
}

function getDepartmentColor(department?: string): string {
  switch (department?.toLowerCase()) {
    case 'engineering': return '#00ff9d';
    case 'design': return '#ff00ff';
    case 'product': return '#00ffff';
    default: return '#4a4a6c';
  }
}
