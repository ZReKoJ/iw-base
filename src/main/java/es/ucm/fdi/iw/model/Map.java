package es.ucm.fdi.iw.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Map {
	
	private long id;
	private String name;
	private String description;
	private Date creationTime;
	// definitions JSON??
	private User owner;
	private byte enabled;
	
	@Id
	@GeneratedValue
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Date getCreationTime() {
		return creationTime;
	}
	
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	
	@ManyToOne(targetEntity=User.class)
	public User getOwner() {
		return owner;
	}
	
	public void setOwner(User owner) {
		this.owner = owner;
	}
	
	public byte getEnabled() {
		return enabled;
	}
	
	public void setEnabled(byte enabled) {
		this.enabled = enabled;
	}
}
