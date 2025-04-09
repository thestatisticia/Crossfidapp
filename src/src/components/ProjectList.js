import React from 'react';
import styled from 'styled-components';

const ProjectCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #eee;
  border-radius: 5px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: #4CAF50;
  width: ${props => props.percentage}%;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
`;

const DonateButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background: #45a049;
  }
`;

const ProjectList = ({ projects, onDonate }) => {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <Title>{project.title}</Title>
          <Description>{project.description}</Description>
          <ProgressBar>
            <Progress percentage={(project.currentAmount / project.targetAmount) * 100} />
          </ProgressBar>
          <Info>
            <span>Raised: {project.currentAmount} XFI</span>
            <span>Target: {project.targetAmount} XFI</span>
            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
          </Info>
          <DonateButton onClick={() => onDonate(project.id)}>
            Donate XFI
          </DonateButton>
        </ProjectCard>
      ))}
    </div>
  );
};

export default ProjectList; 